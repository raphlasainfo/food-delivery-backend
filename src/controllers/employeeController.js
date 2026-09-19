import * as employeeModel from '../models/employeeModel.js';

export const getEmployees = async (req, res, next) => {
  try {
    const { outlet_id } = req.query;
    const employees = await employeeModel.fetchAllEmployees(outlet_id);
    res.status(200).json({ success: true, count: employees.length, data: employees });
  } catch (error) {
    next(error);
  }
};

export const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await employeeModel.fetchEmployeeById(req.params.id);
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });
    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

export const createEmployee = async (req, res, next) => {
  try {
    const { user_id, outlet_id, designation } = req.body;
    if (!user_id || !outlet_id || !designation) {
      return res.status(400).json({ success: false, message: 'user_id, outlet_id, and designation are required' });
    }
    const employee = await employeeModel.createEmployee(req.body);
    res.status(201).json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

export const updateEmployee = async (req, res, next) => {
  try {
    const updated = await employeeModel.updateEmployee(req.params.id, req.body);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteEmployee = async (req, res, next) => {
  try {
    await employeeModel.deleteEmployee(req.params.id);
    res.status(200).json({ success: true, message: 'Employee removed successfully' });
  } catch (error) {
    next(error);
  }
};