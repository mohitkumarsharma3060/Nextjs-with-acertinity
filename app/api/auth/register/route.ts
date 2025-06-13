import { NextRequest,NextResponse} from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/user";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }
    // Connect to the database
    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Create new user
    await User.create({ email, password });
    

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error) {
   return NextResponse.json(
    { error: "failed to register user" },
     { status: 500 }
   );
}
}