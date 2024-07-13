import { Link } from 'react-router-dom'
import { Sheet,SheetContent,SheetTrigger} from '../components/ui/sheet'
import {CiMenuFries} from "react-icons/ci"

const Testsheet = () => {
  return (
    <Sheet>
<SheetTrigger className="flex justify-center items-center">

<CiMenuFries className="text-[32] text-amber-950"/>

    </SheetTrigger>
     <SheetContent className="flex flex-col">
     <div className="mt-32 mb-40 text-center text-2xl">
            <Link to="/">
            <h1 className="text-4xl font-semibold">
                ismail <span className="text-accent">.</span>
            </h1>
            </Link>
        </div>
     <nav className="flex flex-col justify-center items-center gap-8">
  dddd dsdsd dsds
     </nav>
     </SheetContent>

    </Sheet>
  )
}

export default Testsheet
