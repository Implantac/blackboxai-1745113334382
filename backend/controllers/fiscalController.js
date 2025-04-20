const FiscalDocumento = require('../models/FiscalDocumento');

exports.getDocumentosFiscais = async (req, res, next) => {
  try {
    const documentos = await FiscalDocumento.findAll();
    res.json(documentos);
  } catch (error) {
    next(error);
  }
};

exports.getDocumentoFiscalById = async (req, res, next) => {
  try {
    const documento = await FiscalDocumento.findByPk(req.params.id);
    if (!documento) {
      return res.status(404).json({ message: 'Documento fiscal não encontrado' });
    }
    res.json(documento);
  } catch (error) {
    next(error);
  }
};

exports.generateDocumentoFiscal = async (req, res, next) => {
  try {
    const newDocumento = await FiscalDocumento.create(req.body);
    res.status(201).json(newDocumento);
  } catch (error) {
    next(error);
  }
};

exports.updateDocumentoFiscal = async (req, res, next) => {
  try {
    const documento = await FiscalDocumento.findByPk(req.params.id);
    if (!documento) {
      return res.status(404).json({ message: 'Documento fiscal não encontrado' });
    }
    await documento.update(req.body);
    res.json(documento);
  } catch (error) {
    next(error);
  }
};

exports.deleteDocumentoFiscal = async (req, res, next) => {
  try {
    const documento = await FiscalDocumento.findByPk(req.params.id);
    if (!documento) {
      return res.status(404).json({ message: 'Documento fiscal não encontrado' });
    }
    await documento.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const fs = require('fs');
const path = require('path');

exports.exportDocumentoFiscal = async (req, res, next) => {
  try {
    const documento = await FiscalDocumento.findByPk(req.params.id);
    if (!documento) {
      return res.status(404).json({ message: 'Documento fiscal não encontrado' });
    }

    // Simulate export by creating a simple text file with document info
    const exportContent = `Documento Fiscal ID: ${documento.id}\nDescrição: ${documento.descricao || 'N/A'}\nData: ${documento.createdAt}\n`;

    const filePath = path.join(__dirname, '..', 'exports', `documento_fiscal_${documento.id}.txt`);

    // Ensure exports directory exists
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    fs.writeFileSync(filePath, exportContent);

    res.download(filePath, `documento_fiscal_${documento.id}.txt`, (err) => {
      if (err) {
        next(err);
      } else {
        // Optionally delete file after download
        fs.unlinkSync(filePath);
      }
    });
  } catch (error) {
    next(error);
  }
};
