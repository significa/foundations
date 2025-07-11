import {
  FootprintsIcon,
  TreePalmIcon,
  SkullIcon,
  HorseIcon,
  PersonSimpleWalkIcon,
  CloudIcon,
  PersonIcon,
} from "@phosphor-icons/react";

export const erasExtended = [
  {
    title: "Triassic",
    description:
      "The Triassic period (252-201 million years ago) marked the beginning of the dinosaur age, characterized by hot, dry climates and the emergence of the first true dinosaurs.",
    icon: FootprintsIcon,
  },
  {
    title: "Jurassic",
    description:
      "The Jurassic period (201-145 million years ago) saw dinosaurs dominate Earth's ecosystems, with lush forests and giant plant-eaters like the Diplodocus roaming the land.",
    icon: TreePalmIcon,
  },
  {
    title: "Cretaceous",
    description:
      "The Cretaceous period (145-66 million years ago) was the final era of the dinosaurs, ending with a mass extinction event. It featured famous species like Tyrannosaurus rex and Triceratops.",
    icon: SkullIcon,
  },
  {
    title: "Paleocene",
    description:
      "The Paleocene epoch (66-56 million years ago) followed the extinction of the dinosaurs, marked by the rise of mammals and the recovery of ecosystems.",
    icon: CloudIcon,
  },
  {
    title: "Eocene",
    description:
      "The Eocene epoch (56-33.9 million years ago) saw the emergence of most modern mammal orders and the continued evolution of early primates.",
    icon: TreePalmIcon,
  },
  {
    title: "Oligocene",
    description:
      "The Oligocene epoch (33.9-23 million years ago) was characterized by global cooling and the spread of grasslands, leading to the evolution of grazing mammals.",
    icon: HorseIcon,
  },
  {
    title: "Miocene",
    description:
      "The Miocene epoch (23-5.3 million years ago) featured the rise of more modern mammals and the first apes, with expanding grasslands and seasonal forests.",
    icon: PersonIcon,
  },
  {
    title: "Pliocene",
    description:
      "The Pliocene epoch (5.3-2.6 million years ago) saw the emergence of early humans and modern animal species, with cooling climates similar to today.",
    icon: PersonSimpleWalkIcon,
  },
];

export const eras = [...erasExtended].slice(0, 3);
