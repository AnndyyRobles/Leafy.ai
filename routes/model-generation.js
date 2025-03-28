import express from "express"
import { pool } from "../db.js"
import auth from "../middleware/auth.js"
import fs from "fs"
import path from "path"

const router = express.Router()

// Generate a 3D model for a project
router.post("/projects/:id/generate-model", auth, async (req, res) => {
  try {
    const projectId = req.params.id
    const { width, length, height, technique_id } = req.body

    // Check if project exists and belongs to user
    const projectCheck = await pool.query('SELECT * FROM "Project" WHERE id = $1 AND user_id = $2', [
      projectId,
      req.user.id,
    ])

    if (projectCheck.rows.length === 0) {
      return res.status(404).json({ message: "Project not found or unauthorized" })
    }

    // Get technique name
    const techniqueResult = await pool.query('SELECT name FROM "CultivationTechnique" WHERE id = $1', [technique_id])

    if (techniqueResult.rows.length === 0) {
      return res.status(404).json({ message: "Technique not found" })
    }

    const techniqueName = techniqueResult.rows[0].name

    // For this example, we'll use pre-made models based on technique
    // In a real app, you might generate these dynamically or use an AI service

    // Map technique to model file
    const techniqueToModel = {
      Vertical: "vertical-garden.glb",
      "Wall-mounted": "wall-planter.glb",
      Hydroponics: "hydroponic.glb",
      "Recycled Materials": "recycled.glb",
      Aquaponics: "aquaponic.glb",
    }

    const modelFile = techniqueToModel[techniqueName] || "default.glb"
    const modelPath = path.join(__dirname, "..", "public", "models", modelFile)

    // Check if model file exists
    if (!fs.existsSync(modelPath)) {
      return res.status(404).json({ message: "Model file not found" })
    }

    // Send the model file
    res.sendFile(modelPath)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

export default router

