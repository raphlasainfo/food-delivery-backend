import * as outletModel from '../models/outletModel.js';

export const getOutlets = async (req, res, next) => {
  try {
    const outlets = await outletModel.fetchAllOutlets();
    res.status(200).json({ success: true, count: outlets.length, data: outlets });
  } catch (error) {
    next(error);
  }
};

export const getOutletById = async (req, res, next) => {
  try {
    const outlet = await outletModel.fetchOutletById(req.params.id);
    if (!outlet) {
      return res.status(404).json({ success: false, message: 'Outlet not found' });
    }
    res.status(200).json({ success: true, data: outlet });
  } catch (error) {
    next(error);
  }
};

export const createOutlet = async (req, res, next) => {
  try {
    const newOutlet = await outletModel.createOutlet(req.body);
    res.status(201).json({ success: true, data: newOutlet });
  } catch (error) {
    next(error);
  }
};

export const updateOutlet = async (req, res, next) => {
  try {
    const updated = await outletModel.updateOutlet(req.params.id, req.body);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteOutlet = async (req, res, next) => {
  try {
    await outletModel.deleteOutlet(req.params.id);
    res.status(200).json({ success: true, message: 'Outlet deleted successfully' });
  } catch (error) {
    next(error);
  }
};