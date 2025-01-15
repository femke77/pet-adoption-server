import { Request, Response } from "express";
import { Pet } from "../models/pet.js";
// import { Op } from "sequelize";

// GET /Pets/:type?
export const getAllPets = async (req: Request, res: Response) => {
  const {type, breed} = req.params
  const whereClause = type ? breed 
    ? { type, breed } 
    : { type } 
  : {};
  try {
    const users = await Pet.findAll({where: whereClause});
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /Pets/:id
export const getPetById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const pet = await Pet.findByPk(id, {});
    if (pet) {
      res.json(pet);
    } else {
      res.status(404).json({ message: "Pet not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// POST /Pets
export const createPet = async (req: Request, res: Response) => {
  try {
    const pet = new Pet({
      name: req.body.name,
      age: req.body.age,
      breed: req.body.breed,
      type: req.body.type,
      gender: req.body.gender,
      location: req.body.location,
      size: req.body.size,
      image: req.body.image,
    });
    await pet.save();
    res.status(201).json(pet);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /Pets/:id
export const updatePet = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const pet = await Pet.findByPk(id);
    if (pet) {
      pet.name = req.body.name;
      pet.age = req.body.age;
      pet.breed = req.body.breed;
      pet.type = req.body.type;
      pet.gender = req.body.gender;
      pet.location = req.body.location;
      pet.size = req.body.size;
      pet.image = req.body.image;

      await pet.save();
      res.json(pet);
    } else {
      res.status(404).json({ message: "Pet not found" });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /Pets/:id
export const deletePet = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const pet = await Pet.findByPk(id);
    if (pet) {
      await pet.destroy();
      res.json({ message: "Pet deleted" });
    } else {
      res.status(404).json({ message: "Pet not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
