import { Avocado } from "@avocado/http";
import { MainContext } from "@/context/MainContext";

export const app = new Avocado().use(MainContext);
