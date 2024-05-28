import next from "next";
import React from "react";

export const getProducts = async () => {
  const response = await fetch("http://localhost:3000/api/products", (
    {next: {tags: ['collection']}}
  ))
  const result = await response.json()
  console.log(result)

  return result
}