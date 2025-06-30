# backend/main.py
# Simple PrintCraft Backend - Product Upload System

from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey, JSON, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship, joinedload
from sqlalchemy.sql import func
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import os
import uuid
import shutil
from pathlib import Path
from PIL import Image
import json
from slugify import slugify

# =============================================================================
# DATABASE SETUP
# =============================================================================

# Database URL - change this to your database
DATABASE_URL = "sqlite:///./printcraft.db"  # SQLite for simplicity
# For PostgreSQL: "postgresql://user:password@localhost/printcraft_db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# =============================================================================
# DATABASE MODELS
# =============================================================================

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text)
    image_url = Column(String(500))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    products = relationship("Product", back_populates="category")

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, index=True)
    slug = Column(String(200), unique=True, index=True, nullable=False)
    description = Column(Text)
    
    # Pricing
    base_price = Column(Float, nullable=False)
    min_order_quantity = Column(Integer, default=1)
    
    # Product details
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    sizes = Column(JSON)  # Store as JSON: ["S", "M", "L"]
    colors = Column(JSON)  # Store as JSON: ["Red", "Blue", "Green"]
    materials = Column(JSON)  # Store as JSON: ["Cotton", "Polyester"]
    
    # Images and templates
    main_image_url = Column(String(500))
    gallery_images = Column(JSON)  # Store multiple image URLs
    design_template_url = Column(String(500))  # SVG template for design area
    mockup_templates = Column(JSON)  # Store mockup URLs: {"front": "url", "back": "url"}
    
    # Design specifications
    print_areas = Column(JSON)  # Define printable areas with coordinates
    customization_options = Column(JSON)  # Available customization options
    
    # Status
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    category = relationship("Category", back_populates="products")
    variants = relationship("ProductVariant", back_populates="product", cascade="all, delete-orphan")

class ProductVariant(Base):
    __tablename__ = "product_variants"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    color = Column(String(50), nullable=True)
    size = Column(String(50), nullable=True)
    material = Column(String(50), nullable=True)
    price = Column(Float, nullable=False)
    stock = Column(Integer, default=0)
    sku = Column(String(100), nullable=True)
    image_url = Column(String(500), nullable=True)

    # Relationship
    product = relationship("Product", back_populates="variants")

# Create tables
Base.metadata.create_all(bind=engine)

# =============================================================================
# PYDANTIC SCHEMAS (for API validation)
# =============================================================================

class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryResponse(CategoryBase):
    id: int
    slug: str
    image_url: Optional[str] = None
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    base_price: float
    min_order_quantity: int = 1
    category_id: int

class ProductResponse(ProductBase):
    id: int
    slug: str
    sizes: Optional[List[str]] = []
    colors: Optional[List[str]] = []
    materials: Optional[List[str]] = []
    main_image_url: Optional[str] = None
    gallery_images: Optional[List[str]] = []
    design_template_url: Optional[str] = None
    mockup_templates: Optional[Dict[str, str]] = {}
    print_areas: Optional[List[Dict[str, Any]]] = []
    customization_options: Optional[Dict[str, Any]] = {}
    is_active: bool
    is_featured: bool
    created_at: datetime
    category: CategoryResponse
    variants: Optional[List[ProductVariantResponse]] = []
    
    class Config:
        from_attributes = True

class FileUploadResponse(BaseModel):
    filename: str
    url: str
    size: int

# Pydantic Schemas for Variants
class ProductVariantBase(BaseModel):
    color: Optional[str] = None
    size: Optional[str] = None
    material: Optional[str] = None
    price: float
    stock: int = 0
    sku: Optional[str] = None
    image_url: Optional[str] = None

class ProductVariantCreate(ProductVariantBase):
    pass

class ProductVariantResponse(ProductVariantBase):
    id: int
    class Config:
        from_attributes = True

# =============================================================================
# FILE HANDLING UTILITIES
# =============================================================================

# Create upload directories
UPLOAD_DIR = Path("./uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
(UPLOAD_DIR / "products").mkdir(exist_ok=True)
(UPLOAD_DIR / "categories").mkdir(exist_ok=True)
(UPLOAD_DIR / "mockups").mkdir(exist_ok=True)
(UPLOAD_DIR / "templates").mkdir(exist_ok=True)

# File upload settings
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"}

def validate_image_file(file: UploadFile) -> None:
    """Validate uploaded image file"""
    # Check file size
    if hasattr(file, 'size') and file.size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {MAX_FILE_SIZE / (1024*1024):.1f}MB"
        )
    
    # Check file extension
    file_extension = Path(file.filename).suffix.lower()
    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )

async def save_uploaded_file(file: UploadFile, subfolder: str) -> str:
    """Save uploaded file and return the URL"""
    validate_image_file(file)
    
    # Generate unique filename
    file_extension = Path(file.filename).suffix.lower()
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    
    # Create subfolder path
    subfolder_path = UPLOAD_DIR / subfolder
    subfolder_path.mkdir(exist_ok=True)
    
    # Full file path
    file_path = subfolder_path / unique_filename
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Optimize image if it's not SVG
    if file_extension != ".svg":
        optimize_image(file_path)
    
    # Return relative URL
    return f"/uploads/{subfolder}/{unique_filename}"

def optimize_image(file_path: Path, max_width: int = 1200, quality: int = 85) -> None:
    """Optimize image for web usage"""
    try:
        with Image.open(file_path) as image:
            # Convert to RGB if necessary
            if image.mode in ('RGBA', 'P'):
                image = image.convert('RGB')
            
            # Resize if too large
            if image.width > max_width:
                ratio = max_width / image.width
                new_height = int(image.height * ratio)
                image = image.resize((max_width, new_height), Image.Resampling.LANCZOS)
            
            # Save optimized image
            image.save(file_path, 'JPEG', quality=quality, optimize=True)
    except Exception as e:
        print(f"Error optimizing image {file_path}: {e}")

# =============================================================================
# FASTAPI APPLICATION
# =============================================================================

app = FastAPI(
    title="PrintCraft API",
    description="Backend API for PrintCraft custom printing platform",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# =============================================================================
# API ENDPOINTS
# =============================================================================

@app.get("/")
async def root():
    return {"message": "PrintCraft API is running!", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now()}

# =============================================================================
# CATEGORY ENDPOINTS
# =============================================================================

@app.post("/api/categories/", response_model=CategoryResponse)
async def create_category(
    name: str = Form(...),
    description: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    """Create a new product category"""
    
    # Check if category already exists
    existing_category = db.query(Category).filter(Category.name == name).first()
    if existing_category:
        raise HTTPException(status_code=400, detail="Category already exists")
    
    # Handle image upload
    image_url = None
    if image and image.filename:
        image_url = await save_uploaded_file(image, "categories")
    
    # Create category
    category_data = {
        "name": name,
        "slug": slugify(name),
        "description": description,
        "image_url": image_url
    }
    
    db_category = Category(**category_data)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    
    return db_category

@app.get("/api/categories/", response_model=List[CategoryResponse])
def get_categories(
    skip: int = 0,
    limit: int = 100,
    is_active: bool = True,
    db: Session = Depends(get_db)
):
    """Get all categories"""
    categories = db.query(Category).filter(
        Category.is_active == is_active
    ).offset(skip).limit(limit).all()
    return categories

@app.get("/api/categories/{category_id}", response_model=CategoryResponse)
def get_category(category_id: int, db: Session = Depends(get_db)):
    """Get a specific category"""
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

# =============================================================================
# PRODUCT ENDPOINTS
# =============================================================================

@app.post("/api/products/upload", response_model=ProductResponse)
async def upload_product(
    # Product basic info
    name: str = Form(...),
    description: Optional[str] = Form(None),
    base_price: float = Form(...),
    min_order_quantity: int = Form(1),
    category_id: int = Form(...),
    
    # Product specifications (JSON strings)
    sizes: Optional[str] = Form("[]"),  # JSON string: ["S", "M", "L"]
    colors: Optional[str] = Form("[]"),  # JSON string: ["Red", "Blue"]
    materials: Optional[str] = Form("[]"),  # JSON string: ["Cotton"]
    customization_options: Optional[str] = Form("{}"),  # JSON string
    print_areas: Optional[str] = Form("[]"),  # JSON string
    variants: Optional[str] = Form("[]"),  # JSON string for variants
    
    # File uploads
    main_image: UploadFile = File(...),
    gallery_images: Optional[List[UploadFile]] = File([]),
    design_template: Optional[UploadFile] = File(None),
    mockup_front: Optional[UploadFile] = File(None),
    mockup_back: Optional[UploadFile] = File(None),
    
    db: Session = Depends(get_db)
):
    """Upload a new product with all files and variants"""
    try:
        # Parse JSON strings
        sizes_list = json.loads(sizes) if sizes else []
        colors_list = json.loads(colors) if colors else []
        materials_list = json.loads(materials) if materials else []
        customization_opts = json.loads(customization_options) if customization_options else {}
        print_areas_list = json.loads(print_areas) if print_areas else []
        variants_list = json.loads(variants) if variants else []
        
        # Validate category exists
        category = db.query(Category).filter(Category.id == category_id).first()
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        
        # Save main image (required)
        main_image_url = await save_uploaded_file(main_image, "products")
        
        # Save gallery images (optional)
        gallery_urls = []
        for gallery_image in gallery_images:
            if gallery_image.filename:
                gallery_url = await save_uploaded_file(gallery_image, "products")
                gallery_urls.append(gallery_url)
        
        # Save design template (optional)
        design_template_url = None
        if design_template and design_template.filename:
            design_template_url = await save_uploaded_file(design_template, "templates")
        
        # Save mockup templates (optional)
        mockup_templates = {}
        if mockup_front and mockup_front.filename:
            mockup_templates["front"] = await save_uploaded_file(mockup_front, "mockups")
        
        if mockup_back and mockup_back.filename:
            mockup_templates["back"] = await save_uploaded_file(mockup_back, "mockups")
        
        # Create product
        product_data = {
            "name": name,
            "slug": slugify(name),
            "description": description,
            "base_price": base_price,
            "min_order_quantity": min_order_quantity,
            "category_id": category_id,
            "sizes": sizes_list,
            "colors": colors_list,
            "materials": materials_list,
            "main_image_url": main_image_url,
            "gallery_images": gallery_urls,
            "design_template_url": design_template_url,
            "mockup_templates": mockup_templates,
            "print_areas": print_areas_list,
            "customization_options": customization_opts,
        }
        
        db_product = Product(**product_data)
        db.add(db_product)
        db.commit()
        db.refresh(db_product)

        # Add variants if provided
        for variant in variants_list:
            db_variant = ProductVariant(
                product_id=db_product.id,
                color=variant.get("color"),
                size=variant.get("size"),
                material=variant.get("material"),
                price=variant.get("price"),
                stock=variant.get("stock", 0),
                sku=variant.get("sku"),
                image_url=variant.get("image_url"),
            )
            db.add(db_variant)
        db.commit()
        db.refresh(db_product)
        # Reload with variants
        db_product = db.query(Product).options(joinedload(Product.variants)).filter(Product.id == db_product.id).first()
        return db_product
        
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON format: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating product: {str(e)}")

@app.get("/api/products/", response_model=List[ProductResponse])
def get_products(
    skip: int = 0,
    limit: int = 100,
    category_id: Optional[int] = None,
    is_active: bool = True,
    db: Session = Depends(get_db)
):
    """Get all products with optional filtering, including variants"""
    query = db.query(Product).options(joinedload(Product.variants)).filter(Product.is_active == is_active)
    if category_id:
        query = query.filter(Product.category_id == category_id)
    products = query.offset(skip).limit(limit).all()
    return products

@app.get("/api/products/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """Get a specific product by ID, including variants"""
    product = db.query(Product).options(joinedload(Product.variants)).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.put("/api/products/{product_id}/toggle-active")
def toggle_product_active(product_id: int, db: Session = Depends(get_db)):
    """Toggle product active status (soft delete)"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    product.is_active = not product.is_active
    db.commit()
    db.refresh(product)
    
    return {"message": f"Product {'activated' if product.is_active else 'deactivated'} successfully"}

@app.put("/api/products/{product_id}/toggle-featured")
def toggle_product_featured(product_id: int, db: Session = Depends(get_db)):
    """Toggle product featured status"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    product.is_featured = not product.is_featured
    db.commit()
    db.refresh(product)
    
    return {"message": f"Product {'featured' if product.is_featured else 'unfeatured'} successfully"}

# =============================================================================
# UTILITY ENDPOINTS
# =============================================================================

@app.get("/api/stats")
def get_stats(db: Session = Depends(get_db)):
    """Get basic statistics"""
    total_categories = db.query(Category).filter(Category.is_active == True).count()
    total_products = db.query(Product).filter(Product.is_active == True).count()
    featured_products = db.query(Product).filter(
        Product.is_active == True, 
        Product.is_featured == True
    ).count()
    
    return {
        "total_categories": total_categories,
        "total_products": total_products,
        "featured_products": featured_products,
        "timestamp": datetime.now()
    }

# =============================================================================
# DEVELOPMENT HELPER ENDPOINTS
# =============================================================================

@app.post("/api/dev/seed-categories")
def seed_categories(db: Session = Depends(get_db)):
    """Seed database with initial categories (development only)"""
    categories_data = [
        {"name": "Clothing & Apparel", "description": "Custom t-shirts, hoodies, uniforms, and more"},
        {"name": "Drinkware & Kitchen", "description": "Mugs, water bottles, and kitchen accessories"},
        {"name": "Home Decor", "description": "Wall art, cushions, and decorative items"},
        {"name": "Stationery", "description": "Business cards, notebooks, and office supplies"},
        {"name": "Office Ware", "description": "Professional items for your workplace"},
        {"name": "Phone Cases", "description": "Custom cases for all phone models"},
        {"name": "Accessories", "description": "Bags, keychains, and personal items"},
        {"name": "Sportswear", "description": "Athletic wear and sports equipment"},
        {"name": "Kids & Babies", "description": "Safe, fun items for little ones"},
    ]
    
    created_categories = []
    for cat_data in categories_data:
        # Check if already exists
        existing = db.query(Category).filter(Category.name == cat_data["name"]).first()
        if not existing:
            category = Category(
                name=cat_data["name"],
                slug=slugify(cat_data["name"]),
                description=cat_data["description"]
            )
            db.add(category)
            created_categories.append(cat_data["name"])
    
    db.commit()
    
    return {
        "message": f"Seeded {len(created_categories)} categories",
        "categories": created_categories
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)