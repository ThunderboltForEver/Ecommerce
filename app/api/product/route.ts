import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const token = "2|Krr2meJWbTKIR4iCWTX3JysazBcUY4AoCJOHdH9J";

  try {
    const productsResponse = await fetch(
      "https://event-reg.app/flutter_test/api/products",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );


    const productsData = await productsResponse.json();
    
    return NextResponse.json(productsData);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.error();
  }
};
