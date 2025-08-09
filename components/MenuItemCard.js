// import React from 'react';
// import { Plus, Flame, Leaf } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';

// const MenuItemCard = ({ item, onClick }) => {
// //   const { addItem } = useCart();

//   return (
//     <Card
//       className="group cursor-pointer bg-card shadow-soft hover:shadow-card transition-smooth hover:scale-105 border-border"
//       onClick={onClick}
//     >
//       <div className="relative overflow-hidden rounded-t-lg">
//         <img
//           src={item.image}
//           alt={item.name}
//           className="w-full h-48 object-cover group-hover:scale-110 transition-smooth"
//         />

//         {/* Badges */}
//         <div className="absolute top-3 left-3 flex flex-col gap-2">
//           {item.popular && (
//             <Badge className="bg-accent text-accent-foreground shadow-soft">
//               🔥 Popular
//             </Badge>
//           )}
//           {item.spicy && (
//             <Badge variant="outline" className="bg-background/90 text-accent border-accent">
//               <Flame className="w-3 h-3 mr-1" />
//               Spicy
//             </Badge>
//           )}
//           {item.vegetarian && (
//             <Badge variant="outline" className="bg-background/90 text-success border-success">
//               <Leaf className="w-3 h-3 mr-1" />
//               Veggie
//             </Badge>
//           )}
//         </div>

//         {/* Quick Add Button */}
//         <Button
//           size="sm"
//           className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-primary shadow-button opacity-0 group-hover:opacity-100 transition-smooth hover:scale-110"
//           onClick={handleAddToCart}
//         >
//           <Plus className="w-4 h-4" />
//         </Button>
//       </div>

//       <CardContent className="p-4 space-y-3">
//         <div className="space-y-1">
//           <h3 className="font-medium text-lg text-foreground line-clamp-1">{item.name}</h3>
//           <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
//         </div>

//         <div className="flex items-center justify-between">
//           <span className="font-bold text-lg text-primary">${item.price.toFixed(2)}</span>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={handleAddToCart}
//             className="transition-smooth hover:bg-primary hover:text-primary-foreground"
//           >
//             Add
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default MenuItemCard;
