import { useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import './Modal.css';

export default function Modal(props) {

    //const navigate = useNavigate();

    //const [user, setUser] = useContext(UserContext);
    //const [isAuthRequestDone, setIsAuthRequestDone] = useState(false);


    let handleClick = (event) => {
        props.onClose();
    }

    return (
            <>
        { props.isOpen &&  
            <>
                <motion.div 
                    initial={{ opacity: 0}}
                    exit={{ opacity: 0}}
                    animate={{ opacity: 1}}
                    transition={{ duration: 0.1 }}
                    className="backdrop" onClick={handleClick}>
                </motion.div>
            <AnimatePresence>
                <motion.div 
                    className="modal"
                    key="add-modal"
                    initial={{ opacity: 0, transform: "translate(-50%,-50%) scale(0.8)"}}
                    exit={{ opacity: 0, transform: "translate(-50%,-50%) scale(0.8)"}}
                    animate={{ opacity: 1, transform: "translate(-50%,-50%) scale(1)"}}
                    transition={{ duration: 0.3 }}
                >
                    {props.children}
                </motion.div>
            </AnimatePresence>
            </>
        }
        </>
    );

}
