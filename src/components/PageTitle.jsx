import { motion } from "framer-motion";
const PageTitle = ({title, size= "large"}) => {
    if (title === null || title.length === 0)
        return;
    if (size === "small")
        return (
            <motion.h2
                className="text-2xl font-bold text-center mb-3 text-emerald-700 drop-shadow-lg"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {title}
            </motion.h2>
        )
    return (
        <motion.h1
            className="text-4xl font-extrabold text-center mb-8 text-emerald-700 drop-shadow-lg"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            {title}
        </motion.h1>
    )
}
export default PageTitle;