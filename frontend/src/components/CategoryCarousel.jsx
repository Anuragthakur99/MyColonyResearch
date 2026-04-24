"use client"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel"
import { Button } from "./ui/button"
import { setSearchedQuery } from "@/redux/jobSlice"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"

const category = ["Frontend Developer", "Backend Developer", "Data Science", "Graphic Designer", "Fullstack Developer"]

const CategoryCarousel = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const searchJobHandler = (query) => {
    dispatch(setSearchedQuery(query))
    navigate("/browse")
  }

  return (
    <div className="bg-background py-16">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-8 text-foreground">Explore Job Categories</h2>
      <Carousel className="w-full max-w-4xl mx-auto px-4">
        <CarouselContent>
          {category.map((cat, index) => (
            <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/3 pl-4">
              <Button
                onClick={() => searchJobHandler(cat)}
                variant="outline"
                className="w-full rounded-full bg-card text-card-foreground border-2 border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                {cat}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="bg-card text-card-foreground hover:bg-muted border-2 border-primary/30" />
        <CarouselNext className="bg-card text-card-foreground hover:bg-muted border-2 border-primary/30" />
      </Carousel>
    </div>
  )
}

export default CategoryCarousel
