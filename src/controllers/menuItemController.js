import * as menuItemModel from '../models/menuItemModel.js';

export const getMenuItems = async (req, res, next) => {
  try {
    const { outlet_id } = req.query;
    const items = await menuItemModel.fetchMenuItems(outlet_id);
    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

export const getMenuItemById = async (req, res, next) => {
  try {
    const item = await menuItemModel.fetchMenuItemById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const createMenuItem = async (req, res, next) => {
  try {
    const newItem = await menuItemModel.createMenuItem(req.body);
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    next(error);
  }
};

export const updateMenuItem = async (req, res, next) => {
  try {
    const updated = await menuItemModel.updateMenuItem(req.params.id, req.body);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteMenuItem = async (req, res, next) => {
  try {
    await menuItemModel.deleteMenuItem(req.params.id);
    res.status(200).json({ success: true, message: 'Menu item deleted successfully' });
  } catch (error) {
    next(error);
  }
};