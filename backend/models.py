from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey, JSON, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

Base = declarative_base()

class OrderStatus(enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    PRINTING = "printing"
    SHIPPING = "shipping"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    slug = Column(String(200), unique=True, index=True)
    description = Column(Text)
    base_price = Column(Float, nullable=False)
    min_order_quantity = Column(Integer, default=1)
    max_order_quantity = Column(Integer, default=1000)
    
    # Enhanced product data
    category_id = Column(Integer, ForeignKey("categories.id"))
    brand = Column(String(100))
    weight = Column(Float)  # in grams
    dimensions = Column(JSON)  # {"length": 10, "width": 8, "height": 0.5}
    material_info = Column(JSON)  # detailed material specifications
    care_instructions = Column(Text)
    
    # Print specifications
    print_areas = Column(JSON)  # Multiple print areas with coordinates
    print_methods = Column(JSON)  # ["screen_print", "digital", "embroidery"]
    color_limitations = Column(JSON)  # max colors per print method
    
    # Design templates and mockups
    design_template_url = Column(String(500))
    mockup_templates = Column(JSON)  # front, back, side views
    size_chart_url = Column(String(500))
    
    # SEO and marketing
    meta_title = Column(String(200))
    meta_description = Column(Text)
    tags = Column(JSON)  # ["trendy", "unisex", "eco-friendly"]
    
    # Inventory and logistics
    production_time = Column(Integer, default=3)  # days
    shipping_time = Column(Integer, default=7)  # days
    
    # Status flags
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    is_customizable = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    category = relationship("Category", back_populates="products")
    variants = relationship("ProductVariant", back_populates="product")
    order_items = relationship("OrderItem", back_populates="product")
    reviews = relationship("ProductReview", back_populates="product")

class ProductVariant(Base):
    __tablename__ = "product_variants"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    
    # Variant attributes
    color = Column(String(50))
    size = Column(String(20))
    material = Column(String(100))
    
    # Pricing and inventory
    price_modifier = Column(Float, default=0.0)  # additional cost
    stock_quantity = Column(Integer, default=0)
    sku = Column(String(100), unique=True, index=True)
    
    # Variant specific data
    image_url = Column(String(500))
    weight_modifier = Column(Float, default=0.0)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    product = relationship("Product", back_populates="variants")

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(50), unique=True, index=True)
    customer_email = Column(String(255), nullable=False)
    customer_name = Column(String(200))
    
    # Order details
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING)
    subtotal = Column(Float, nullable=False)
    tax_amount = Column(Float, default=0.0)
    shipping_cost = Column(Float, default=0.0)
    total_amount = Column(Float, nullable=False)
    
    # Shipping information
    shipping_address = Column(JSON)
    billing_address = Column(JSON)
    shipping_method = Column(String(100))
    tracking_number = Column(String(100))
    
    # Order processing
    design_approved = Column(Boolean, default=False)
    production_started = Column(DateTime)
    estimated_delivery = Column(DateTime)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    order_items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    variant_id = Column(Integer, ForeignKey("product_variants.id"))
    
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)
    
    # Custom design data
    design_data = Column(JSON)  # Fabric.js canvas data
    design_preview_url = Column(String(500))
    print_files = Column(JSON)  # high-res files for printing
    
    # Production notes
    production_notes = Column(Text)
    quality_check_passed = Column(Boolean, default=False)
    
    # Relationships
    order = relationship("Order", back_populates="order_items")
    product = relationship("Product", back_populates="order_items")
    variant = relationship("ProductVariant")

class ProductReview(Base):
    __tablename__ = "product_reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    customer_email = Column(String(255))
    customer_name = Column(String(200))
    
    rating = Column(Integer, nullable=False)  # 1-5 stars
    title = Column(String(200))
    review_text = Column(Text)
    
    # Review validation
    verified_purchase = Column(Boolean, default=False)
    is_approved = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    product = relationship("Product", back_populates="reviews")

# Enhanced API endpoints
from fastapi import FastAPI, HTTPException, Depends, File, UploadFile, Form
from pydantic import BaseModel
from typing import List, Optional
import uuid
import os
from datetime import datetime, timedelta

class OrderCreate(BaseModel):
    customer_email: str
    customer_name: str
    shipping_address: dict
    billing_address: dict
    items: List[dict]

class DesignData(BaseModel):
    canvas_data: dict
    preview_url: str
    print_areas: List[dict]

@app.post("/api/orders/", response_model=dict)
async def create_order(order_data: OrderCreate, db: Session = Depends(get_db)):
    """Create a new order with custom designs"""
    
    # Generate unique order number
    order_number = f"PC{datetime.now().strftime('%Y%m%d')}{uuid.uuid4().hex[:6].upper()}"
    
    # Calculate totals
    subtotal = sum(item['quantity'] * item['unit_price'] for item in order_data.items)
    tax_amount = subtotal * 0.08  # 8% tax
    shipping_cost = 15.0 if subtotal < 50 else 0.0  # Free shipping over $50
    total_amount = subtotal + tax_amount + shipping_cost
    
    # Create order
    db_order = Order(
        order_number=order_number,
        customer_email=order_data.customer_email,
        customer_name=order_data.customer_name,
        subtotal=subtotal,
        tax_amount=tax_amount,
        shipping_cost=shipping_cost,
        total_amount=total_amount,
        shipping_address=order_data.shipping_address,
        billing_address=order_data.billing_address,
        estimated_delivery=datetime.now() + timedelta(days=10)
    )
    
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    # Create order items
    for item in order_data.items:
        db_item = OrderItem(
            order_id=db_order.id,
            product_id=item['product_id'],
            variant_id=item.get('variant_id'),
            quantity=item['quantity'],
            unit_price=item['unit_price'],
            total_price=item['quantity'] * item['unit_price'],
            design_data=item.get('design_data'),
            design_preview_url=item.get('design_preview_url')
        )
        db.add(db_item)
    
    db.commit()
    
    # Send confirmation email (implement email service)
    # await send_order_confirmation(order_data.customer_email, db_order)
    
    return {
        "order_id": db_order.id,
        "order_number": order_number,
        "total_amount": total_amount,
        "estimated_delivery": db_order.estimated_delivery
    }

@app.post("/api/orders/{order_id}/approve-design")
async def approve_design(order_id: int, approved: bool, db: Session = Depends(get_db)):
    """Approve or reject order design"""
    
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.design_approved = approved
    if approved:
        order.status = OrderStatus.PROCESSING
        order.production_started = datetime.now()
    
    db.commit()
    
    return {"message": "Design approval status updated"}

@app.get("/api/orders/{order_id}/tracking")
async def get_order_tracking(order_id: int, db: Session = Depends(get_db)):
    """Get order tracking information"""
    
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    tracking_info = {
        "order_number": order.order_number,
        "status": order.status.value,
        "estimated_delivery": order.estimated_delivery,
        "tracking_number": order.tracking_number,
        "timeline": [
            {"stage": "Order Placed", "date": order.created_at, "completed": True},
            {"stage": "Design Approved", "date": order.created_at, "completed": order.design_approved},
            {"stage": "Production Started", "date": order.production_started, "completed": order.production_started is not None},
            {"stage": "Shipped", "date": None, "completed": order.status in [OrderStatus.SHIPPING, OrderStatus.DELIVERED]},
            {"stage": "Delivered", "date": None, "completed": order.status == OrderStatus.DELIVERED}
        ]
    }
    
    return tracking_info 