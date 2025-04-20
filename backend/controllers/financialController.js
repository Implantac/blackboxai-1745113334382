const Transacao = require('../models/Transacao');

exports.getAllTransacoes = async (req, res, next) => {
  try {
    const transacoes = await Transacao.findAll();
    res.json(transacoes);
  } catch (error) {
    next(error);
  }
};

exports.getTransacaoById = async (req, res, next) => {
  try {
    const transacao = await Transacao.findByPk(req.params.id);
    if (!transacao) {
      return res.status(404).json({ message: 'Transação não encontrada' });
    }
    res.json(transacao);
  } catch (error) {
    next(error);
  }
};

exports.createTransacao = async (req, res, next) => {
  try {
    const newTransacao = await Transacao.create(req.body);
    res.status(201).json(newTransacao);
  } catch (error) {
    next(error);
  }
};

exports.updateTransacao = async (req, res, next) => {
  try {
    const transacao = await Transacao.findByPk(req.params.id);
    if (!transacao) {
      return res.status(404).json({ message: 'Transação não encontrada' });
    }
    await transacao.update(req.body);
    res.json(transacao);
  } catch (error) {
    next(error);
  }
};

exports.deleteTransacao = async (req, res, next) => {
  try {
    const transacao = await Transacao.findByPk(req.params.id);
    if (!transacao) {
      return res.status(404).json({ message: 'Transação não encontrada' });
    }
    await transacao.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const { Sequelize } = require('sequelize');
const Transacao = require('../models/Transacao');

exports.getCashFlow = async (req, res, next) => {
  try {
    const totalIncome = await Transacao.sum('valor', { where: { tipo: 'entrada' } });
    const totalExpense = await Transacao.sum('valor', { where: { tipo: 'saida' } });
    const balance = (totalIncome || 0) - (totalExpense || 0);

    res.status(200).json({
      totalIncome: totalIncome || 0,
      totalExpense: totalExpense || 0,
      balance,
    });
  } catch (error) {
    next(error);
  }
};

exports.processTefPayment = async (req, res, next) => {
  try {
    // Simulated TEF payment processing
    const { amount, cardNumber, cardHolder, expiration, cvv } = req.body;

    if (!amount || !cardNumber || !cardHolder || !expiration || !cvv) {
      return res.status(400).json({ message: 'Dados do cartão incompletos' });
    }

    // Simulate success or failure randomly
    const success = Math.random() > 0.2;

    if (success) {
      res.status(200).json({ message: 'Pagamento TEF aprovado', transactionId: Date.now() });
    } else {
      res.status(400).json({ message: 'Pagamento TEF recusado' });
    }
  } catch (error) {
    next(error);
  }
};
