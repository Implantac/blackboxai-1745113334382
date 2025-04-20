const ProdutoMinibar = require('../models/ProdutoMinibar');

exports.getAllProdutos = async (req, res, next) => {
  try {
    const produtos = await ProdutoMinibar.findAll();
    res.json(produtos);
  } catch (error) {
    next(error);
  }
};

exports.getProdutoById = async (req, res, next) => {
  try {
    const produto = await ProdutoMinibar.findByPk(req.params.id);
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.json(produto);
  } catch (error) {
    next(error);
  }
};

exports.createProduto = async (req, res, next) => {
  try {
    const newProduto = await ProdutoMinibar.create(req.body);
    res.status(201).json(newProduto);
  } catch (error) {
    next(error);
  }
};

exports.updateProduto = async (req, res, next) => {
  try {
    const produto = await ProdutoMinibar.findByPk(req.params.id);
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    await produto.update(req.body);

    // Emit real-time update event
    if (req.io) {
      req.io.emit('minibarUpdated', produto);
    }

    res.json(produto);
  } catch (error) {
    next(error);
  }
};

exports.deleteProduto = async (req, res, next) => {
  try {
    const produto = await ProdutoMinibar.findByPk(req.params.id);
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    await produto.destroy();

    // Emit real-time delete event
    if (req.io) {
      req.io.emit('minibarDeleted', { id: req.params.id });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

exports.consumeProduct = async (req, res, next) => {
  try {
    const { roomId, productId } = req.params;
    const produto = await ProdutoMinibar.findByPk(productId);
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    if (produto.estoque <= 0) {
      return res.status(400).json({ message: 'Estoque insuficiente para consumo' });
    }
    await produto.update({ estoque: produto.estoque - 1 });

    // Emit real-time update event
    if (req.io) {
      req.io.emit('minibarUpdated', produto);
    }

    res.status(200).json({ message: `Consumo do produto ${produto.nome} registrado para o quarto ${roomId}` });
  } catch (error) {
    next(error);
  }
};

exports.restockProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const produto = await ProdutoMinibar.findByPk(productId);
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Quantidade inválida para reposição' });
    }
    await produto.update({ estoque: produto.estoque + quantity });

    // Emit real-time update event
    if (req.io) {
      req.io.emit('minibarUpdated', produto);
    }

    res.status(200).json({ message: `Reposição de ${quantity} unidades do produto ${produto.nome} realizada com sucesso.` });
  } catch (error) {
    next(error);
  }
};
