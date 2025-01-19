import { Request, Response } from 'express';
import { Pet } from '../models/pet.js';

// GET /Pets/:type?/:breed?
export const getAllPets = async (req: Request, res: Response) => {
  const { type, breed } = req.params;
  const whereClause = type ? (breed ? { type, breed } : { type }) : {};
  try {
    const pets = await Pet.findAll({ where: whereClause });
    const updatedPets = await Promise.all(
      pets.map(async (pet) => {
        const numUsers = await pet.countUsers();
        const petData = pet.get({ plain: true });
        return { ...petData, num_users: numUsers };
      }),
    );
    res.json(updatedPets);
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// GET /Pets/:id with number of users who are interested in the pet
export const getPetById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const pet = await Pet.findByPk(id);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    const numUsers = await pet.countUsers();
    return res.json({ ...pet.toJSON(), num_users: numUsers });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
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
    const pet = await Pet.update(req.body, {
      where: { id: id },
      returning: true,
    });
    if (pet) {
      res.json(pet);
    } else {
      res.status(404).json({ message: 'Pet not found' });
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
      res.json({ message: 'Pet deleted' });
    } else {
      res.status(404).json({ message: 'Pet not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
