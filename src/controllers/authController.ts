import { Request, Response } from "express";

import { generateToken } from "../utils/jwt";
import { signupSchema, loginSchema } from "../utils/validation";
import { User } from "../models/user";

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate input
    const validatedData = signupSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      res.status(400).json({ error: "User already exists with this email" });
      return;
    }

    // Create new user
    const user = new User(validatedData);
    await user.save();

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      res
        .status(400)
        .json({ error: "Validation failed", details: error.errors });
      return;
    }
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate input
    const validatedData = loginSchema.parse(req.body);

    // Find user
    const user = await User.findOne({ email: validatedData.email });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Check password
    const isPasswordValid = await user.comparePassword(validatedData.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      res
        .status(400)
        .json({ error: "Validation failed", details: error.errors });
      return;
    }
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
