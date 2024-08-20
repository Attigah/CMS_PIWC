import User from "@/models/User";
import connect from "@/utils/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (request: any) => {
  const { FirstName, LastName, email, password } = await request.json();

  await connect();

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return new NextResponse("Email is already in use", { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = new User({
      FirstName,
      LastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return new NextResponse("User registered successfully", { status: 201 });
  } catch (err) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
