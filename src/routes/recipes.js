import express from 'express';
import mongoose from 'mongoose';

import { RecipeModel } from "../models/Recipes.js";
import { UserModel } from '../models/Users.js';
import { verifyToken } from './users.js';

const router = express.Router();


router.get("/", async (req, res) => {
    try{
        const response = await RecipeModel.find({}); // retorna todas as receitas
        return res.json(response);
    }
    catch(err) {
        return res.json(err);
    }
});


router.post("/", verifyToken, async (req, res) => {

    const recipe = new RecipeModel(req.body);

    try{
        const response = await recipe.save();
        
        
        return res.json(response);
    }
    catch(err) {
        return res.json(err);
    }
});

router.put("/save", verifyToken, async (req, res) => {
    
    try{
        const recipe = await RecipeModel.findById(req.body.recipeId);
        const user = await UserModel.findById(req.body.userId);
        
        user.savedRecipes.push(recipe);

        await user.save();

        return res.json({ savedRecipes: user.savedRecipes });
    }
    catch(err) {
        return res.json(err);
    }
});

router.get('/savedRecipes/ids/:userId', async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userId);
        return res.json({ savedRecipes: user?.savedRecipes });
    } 
    catch (err) {
        return res.json(err);
    }
});

router.get('/savedRecipes/:userId', async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userId);
        const savedRecipes = await RecipeModel.find({
            _id: { $in: user.savedRecipes }
        });

        return res.json({ savedRecipes });
    } 
    catch (err) {
        return res.json(err);
    }
});

export { router as recipesRouter };