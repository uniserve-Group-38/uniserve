export const SERVICE_CATEGORIES = [
  "Academics",
  "Tech Support",
  "Cleaning",
  "Food Delivery",
  "Personal Care",
  "Fashion",
  "Other"
] as const;

export type ServiceCategory = typeof SERVICE_CATEGORIES[number];

export const DEFAULT_CATEGORY_IMAGES: Record<ServiceCategory | string, string> = {
  "Academics": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1000&auto=format&fit=crop",
  "Tech Support": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHRlY2hub2xvZ3l8ZW58MHx8MHx8fDA%3D",
  "Cleaning": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1000&auto=format&fit=crop",
  "Food Delivery": "https://images.unsplash.com/photo-1615719413546-198b25453f85?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Zm9vZCUyMGRlbGl2ZXJ5fGVufDB8fDB8fHww",
  "Personal Care": "https://images.unsplash.com/photo-1516975080661-46b0744db6f6?q=80&w=1000&auto=format&fit=crop",
  "Fashion": "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1000&auto=format&fit=crop",
  "Other": "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?q=80&w=1000&auto=format&fit=crop"
};
