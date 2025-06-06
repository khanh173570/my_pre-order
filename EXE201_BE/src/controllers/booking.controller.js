import Booking from '../models/booking.model.js';
import Product from '../models/product.model.js';

export const createBooking = async (req, res) => {
  try {
    const { products } = req.body;
    let totalAmount = 0;

    // Calculate total amount and check stock
    for (let item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
      totalAmount += product.price * item.quantity;
    }

    const booking = await Booking.create({
      user: req.user._id,
      products,
      totalAmount
    });

    // Update product stock
    for (let item of products) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getBookings = async (req, res) => {
  try {
    const query = req.user.role === 'user' ? { user: req.user._id } : {};
    const bookings = await Booking.find(query)
      .populate('user', 'name email')
      .populate('products.product');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};