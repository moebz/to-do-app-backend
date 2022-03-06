const { ObjectId } = require('mongoose').Types;
const { log } = require('../common/utils');
const {
  CategoriaMod, ProductoMod, CategoriasColgadasMod, ProductIncompletooMod,
} = require('./schema');

const addProduct = async (producto) => producto.save();
const addCategory = async (categoria) => categoria.save();

const updateProduct = async (data) => {
  log('updateProduct.data', data);

  const fieldsToUpdate = {
    nombre: data.nombre,
    organizacionID: data.organizacionID,
    precio: data.precio,
    estado: data.estado,
    estadoDesc: data.estadoDesc,
    categorias: data.categorias,
    imagenes: data.imagenes,
    imagenPrincipal: data.imagenPrincipal,
    attrs: data.attrs,
    sattrs: data.sattrs,
    verifiedBy: data.verifiedBy,
    updateTs: new Date(),
  };

  const result = await ProductoMod.findOneAndUpdate(
    {
      _id: new ObjectId(data._id),
    },
    {
      $set: fieldsToUpdate,
    },
    {
      new: true,
    },
  ).exec();
  return result;
};

const doAddImageToProduct = async (data) => {
  log('doAddImageToProduct.data', data);
  const fieldsToUpdate = { updateTs: new Date() };

  if (data.estado) {
    fieldsToUpdate.estado = data.estado;
  }

  const result = await ProductIncompletooMod.findOneAndUpdate(
    {
      _id: new ObjectId(data._id),
    },
    {
      $push: {
        imagenes: {
          originalUrl: data.imagen,
          originalFechaSubida: new Date(),
        },
      },
      $set: fieldsToUpdate,
    },
    {
      new: true,
    },
  ).exec();
  log('doAddImageToProduct.result', result);
  return result;
};

const updateProductDetails = async (data) => {
  const fieldsToUpdate = {
    nombre: data.nombre,
    organizacionID: data.organizacionID,
    precio: data.precio,
    estado: data.estado,
    estadoDesc: data.estadoDesc,
    categorias: data.categorias,
    attrs: data.attrs,
    sattrs: data.sattrs,
    verifiedBy: data.verifiedBy,
    updateTs: new Date(),
  };

  const result = await ProductIncompletooMod.findOneAndUpdate(
    {
      _id: new ObjectId(data._id),
    },
    {
      $set: fieldsToUpdate,
    },
    {
      new: true,
    },
  ).exec();
  return result;
};

const doSetEditedImage = async (data) => {
  log('doSetEditedImage.data', data);

  const producto = await ProductIncompletooMod.findOne(
    {
      _id: new ObjectId(data.publicacionID),
    },
  );

  log('doSetEditedImage.productoFound', producto);

  const imagen = producto.imagenes.id(data.imagenID);

  imagen.url = data.imagen;
  imagen.key = data.key;
  imagen.bucket = data.bucket;

  if (producto.estado !== 'INCOMPLETO') {
    producto.estado = 'VALIDANDO';
  }

  log('doSetEditedImage.beforeSave.producto', producto);
  log('doSetEditedImage.beforeSave.imagen', imagen);

  const updatedProducto = await producto.save();

  log('doSetEditedImage.afterSave');

  log('doSetEditedImage.updatedProducto', updatedProducto);

  return updatedProducto;
};

const setImagenPrincipal = async (data) => {
  log('setImagenPrincipal.data', data);

  if (
    !data.publicacionID
    || !data.imagenID
    || !data.url
  ) {
    throw new Error('Parameters missing');
  }

  const producto = await ProductIncompletooMod.findOne(
    {
      _id: new ObjectId(data.publicacionID),
    },
  ).exec();

  if (!producto) {
    throw new Error('Producto not found');
  }

  if (producto.estado !== 'INCOMPLETO') {
    producto.estado = 'VALIDANDO';
  }

  producto.imagenPrincipal = {
    imagenID: data.imagenID,
    url: data.url,
  };

  await producto.save();

  return producto;
};

const updateProductIncompleto = async (data) => {
  const fieldsToUpdate = {
    nombre: data.nombre,
    precio: data.precio,
    estado: data.estado,
    categorias: data.categorias,
    attrs: data.attrs,
    sattrs: data.sattrs,
    verifiedBy: data.verifiedBy,
    updateTs: new Date(),
  };

  const result = await ProductIncompletooMod.findOneAndUpdate(
    {
      _id: new ObjectId(data._id),
    },
    {
      $set: fieldsToUpdate,
    },
    {
      new: true,
    },
  ).exec();
  return result;
};

const updateCategory = async (data) => {
  const fieldsToUpdate = {
    nombre: data.nombre,
    parent: data.parent,
    estado: data.estado,
    categoria: data.categoria,
    updateTs: new Date(),
  };

  const result = await CategoriaMod.findOneAndUpdate(
    {
      _id: new ObjectId(data.categoriaId ? data.categoriaId : data._id),
    },
    {
      $set: fieldsToUpdate,
    },
    {
      new: true,
    },
  ).exec();
  return result;
};

const updateCategoryPath = async (data) => {
  const fieldsToUpdate = {
    parent: data.parent,
    categoria: data.categoria,
    updateTs: new Date(),
  };

  const result = await CategoriaMod.findOneAndUpdate(
    {
      _id: new ObjectId(data.id),
    },
    {
      $set: fieldsToUpdate,
    },
    {
      new: true,
    },
  ).exec();
  return result;
};

const getProductosByAttrs = async (data) => {
  if (data.id && !ObjectId.isValid(data.id)) {
    return [];
  }
  const sort = {};
  if (data.orderby === 'precio') {
    sort.precio = data.tipoOrden;
  }
  if (data.orderby === 'kilometraje') {
    sort['attrs.kilometraje'] = data.tipoOrden;
  }
  if (data.orderby === 'ts') {
    sort.ts = data.tipoOrden;
  }
  const filters = setFiltersForCarsSearch(data);
  log('producto.model.getProductosByAttrs.filters', filters);
  log('producto.model.getProductosByAttrs.sort', sort);
  const result = await ProductoMod
    .find(filters)
    .limit(data.limit * 1)
    .skip((data.page - 1) * data.limit)
    .sort(sort)
    .exec();
  return result;
};

const countPublicaciones = async (data) => {
  if (data.id && !ObjectId.isValid(data.id)) {
    return 0;
  }
  const sort = {};
  if (data.orderby === 'precio') {
    sort.precio = data.tipoOrden;
  }
  if (data.orderby === 'kilometraje') {
    sort['attrs.kilometraje'] = data.tipoOrden;
  }
  const filters = setFiltersForCarsSearch(data);
  const result = await ProductoMod.countDocuments(filters).exec();
  return result;
};

const deleteProducts = async () => {
  const filters = {
    nombre: 'test',
  };

  const result = await ProductoMod.deleteMany(filters).exec();
  const result2 = await CategoriaMod.deleteMany(filters).exec();
  return result;
};

const getCategoriasHijas = async (data) => {
  const filters = {
    parent: { $regex: data.subtrees ? `^${data.categoria}` : `^${data.categoria}$` },
  };

  const result = await CategoriaMod.find(filters, { _id: 1, parent: 1, categoria: 1 }).exec();
  return result;
};

const getParentCategories = async (data) => {
  const elements = data.categoria.split('/');

  const paths = [];

  for (let i = 0; i <= elements.length; i++) {
    elements.pop();
    paths.push(elements.join('/'));
  }

  // paths.push('/');
  paths.reverse();

  const filters = {
    categoria: { $in: paths },
  };

  const result = await CategoriaMod.find(filters).exec();
  return result;
};

const getPublicacionIncompletaById = async (id) => {
  const result = await ProductIncompletooMod.findOne({ _id: ObjectId(id) }).exec();
  return result;
};
const getPublicacionCompletaById = async (id) => {
  const result = await ProductoMod.findOne({ _id: ObjectId(id) }).exec();
  return result;
};

const getPublicacionByPublicacionIncompleta = async (id) => {
  const result = await ProductoMod.findOne({ _id: ObjectId(id) }).exec();
  return result;
};

const getCategoriaById = async (id) => {
  const localFound = await CategoriaMod.findOne({ _id: ObjectId(id) }).exec();
  return localFound;
};
// TODO minimo con 2 categorias que pasa (mesas/etc, mesas/abc)
// categoria afectada puede estar al comienzo, medio final
const updateProductCategory = async (id, nuevaCategoria, categoriaOriginal) => {
  const result = await ProductoMod.findOneAndUpdate(
    {
      _id: new ObjectId(id),
      categorias: { $regex: `^${categoriaOriginal}` },
    },
    {
      $set: { 'categorias.$': nuevaCategoria },
    },
    {
      new: true,
    },
  ).exec();
  return result;
};

const addCategoriaToBeUpdated = async (categoria) => categoria.save();

const updateCategoriaToBeUpdated = async (id) => {
  const fieldsToUpdate = {
    estado: 'PROCESADO',
  };

  const result = await CategoriasColgadasMod.findOneAndUpdate(
    {
      _id: new ObjectId(id),
    },
    {
      $set: fieldsToUpdate,
    },
    {
      new: true,
    },
  ).exec();
  return result;
};

const getCategoriasToBeUopdated = async () => {
  const filters = {
    estado: 'PENDIENTE',
  };
  const result = await CategoriasColgadasMod.find(filters).exec();
  return result;
};

const getPublicacionesPorValidar = async () => {
  const filters = {
    estado: 'VALIDANDO',
  };
  const result = await ProductIncompletooMod.find(filters).exec();
  return result;
};

const getPublicacionesByUsuario = async (id, limit, page) => {
  const filters = {
    userId: id,
    estado: { $ne: 'ELIMINADO' },
  };
  const result = await ProductIncompletooMod.find(filters).limit(limit * 1).skip((page - 1) * limit).exec();
  return result;
};

const countDocuments = async (id) => {
  const filters = {
    userId: id,
    estado: { $ne: 'ELIMINADO' },
  };
  const result = await ProductIncompletooMod.countDocuments(filters).exec();
  return result;
};

module.exports = {
  addProduct,
  addCategory,
  updateProduct,
  doAddImageToProduct,
  updateCategory,
  getProductosByAttrs,
  deleteProducts,
  getCategoriasHijas,
  getParentCategories,
  getCategoriaById,
  updateProductCategory,
  addCategoriaToBeUpdated,
  updateCategoriaToBeUpdated,
  updateCategoryPath,
  getCategoriasToBeUopdated,
  setImagenPrincipal,
  doSetEditedImage,
  getPublicacionIncompletaById,
  updateProductIncompleto,
  updateProductDetails,
  getPublicacionesPorValidar,
  getPublicacionesByUsuario,
  getPublicacionByPublicacionIncompleta,
  countDocuments,
  countPublicaciones,
  getPublicacionCompletaById,
};
