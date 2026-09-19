import * as wageModel from '../models/wageModel.js';
import * as employeeModel from '../models/employeeModel.js';

export const getWages = async (req, res, next) => {
  try {
    const { employee_id } = req.query;
    const records = await wageModel.fetchWages(employee_id);
    res.status(200).json({ success: true, count: records.length, data: records });
  } catch (error) {
    next(error);
  }
};

export const logWageActivity = async (req, res, next) => {
  try {
    const { employee_id, hours_worked, amount, notes } = req.body;

    if (!employee_id) {
      return res.status(400).json({ success: false, message: 'employee_id is required' });
    }

    // Lookup employee by primary ID or linked user ID
    const employee = await employeeModel.fetchEmployeeById(employee_id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: `Employee record not found for ID: ${employee_id}`,
      });
    }

    // Calculate payout if not explicitly provided
    let calculatedAmount = amount;
    if (!calculatedAmount) {
      const hours = Number(hours_worked) || 0;
      const rate = Number(employee.hourly_rate) || 0;
      calculatedAmount = hours * rate;
    }

    const wageRecord = await wageModel.recordWage({
      employee_id: employee.id, // Enforces valid employee primary key
      hours_worked: hours_worked || 0,
      amount: calculatedAmount,
      notes: notes || null,
      payment_status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Wage logged successfully',
      data: wageRecord,
    });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { payment_status } = req.body;
    if (!['pending', 'paid', 'cancelled'].includes(payment_status)) {
      return res.status(400).json({ success: false, message: 'Invalid payment status' });
    }

    const updated = await wageModel.updateWageStatus(req.params.id, payment_status);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};