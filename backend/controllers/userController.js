import User from "../models/User.js";
import getIdFromBodyParam from "../utils/getIdFromBodyParam.js";

export async function create(req, res) {
  if (req.body.id) {
    res
      .status(400)
      .send(`ID is determined by database and should not be provided.`);
  }

  await User.create(req.body);
  res.status(201).end();
}

export async function update(req, res) {
  const id = getIdFromBodyParam(req);

  await User.update(req.body, {
    where: {
      id: id,
    },
  });
  res.status(200).end();
}

export async function del(req, res) {
  const id = getIdFromBodyParam(req);
  await User.destroy({
    where: {
      id: id,
    },
  });
  res.status(200).end();
}

export default { create, update, del };