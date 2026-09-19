import { fetchAllOutlets, fetchOutletById } from '../models/outletModel.js';

export const getOutlets = async (req, res, next) => {
  try {
    const outlets = await fetchAllOutlets();
    res.status(200).json({
      success: true,
      count: outlets.length,
      data: outlets,
    });
  } catch (error) {
    next(error);
  }
};

export const getOutletById = async (req, res, next) => {
  try {
    const outlet = await fetchOutletById(req.params.id);
    if (!outlet) {
      return res.status(404).json({ success: false, message: 'Outlet not found' });
    }
    res.status(200).json({ success: true, data: outlet });
  } catch (error) {
    next(error);
  }
};