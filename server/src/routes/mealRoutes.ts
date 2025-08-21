import { Router, Request, Response } from "express";
import mealModel from "../models/mealModel";
const router = Router();

// GET all meals
router.get("/", async (_req: Request, res: Response) => {
  try {
    const meals = await mealModel.find().sort({ meal_date: -1 });
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch meals" });
  }
});

// POST new meal
router.post("/", async (req: Request, res: Response) => {
  try {
    const { meal_date, meal_type, headcount } = req.body;
    const meal = new mealModel({ meal_date, meal_type, headcount });
    await meal.save();
    res.status(201).json(meal);
  } catch (err) {
    res.status(400).json({ error: "Failed to add meal" });
  }
});

// PUT update meal
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { meal_date, meal_type, headcount } = req.body;
    const updatedMeal = await mealModel.findByIdAndUpdate(
      id,
      { meal_date, meal_type, headcount },
      { new: true }
    );
    if (!updatedMeal) return res.status(404).json({ error: "Meal not found" });
    res.json(updatedMeal);
  } catch (err) {
    res.status(400).json({ error: "Failed to update meal" });
  }
});

// DELETE meal
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedMeal = await mealModel.findByIdAndDelete(id);
    if (!deletedMeal) return res.status(404).json({ error: "Meal not found" });
    res.json({ message: "Meal deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete meal" });
  }
});

export default router;
