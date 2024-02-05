import { useState, useRef, useId, type ElementType } from 'react'
import {
    useFloating,
    FloatingPortal,
    arrow,
    shift,
    offset,
    type Placement,
    flip,
    autoUpdate,
    useHover,
    useFocus,
    useDismiss,
    useRole,
    useInteractions,
    safePolygon
} from '@floating-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

export const Popover = () => {
    const [isOpen, setIsOpen] = useState(false);
    const arrowRef = useRef(null);
    const { refs, floatingStyles, context, middlewareData } = useFloating({
        open: isOpen,
        middleware: [offset(18), shift(), arrow({ element: arrowRef })]
    });

    const openPopover = () => {
        setIsOpen(true)
    }

    const hiddenPopover = () => {
        setIsOpen(false)
    }

    const hover = useHover(context);

    const { getReferenceProps, getFloatingProps } = useInteractions([
        hover,
    ]);
    return (
        <Link to='' className="flex item-center hover:text-gray-300" ref={refs.setReference} {...getReferenceProps()} onMouseEnter={openPopover} onMouseLeave={hiddenPopover} >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            Tiếng Việt
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
            <FloatingPortal>
                <AnimatePresence>

                    {isOpen && (
                        <motion.div
                            ref={refs.setFloating}
                            style={floatingStyles}
                            {...getFloatingProps()}
                            initial={{ opacity: 0, transform: 'scale(0)' }}
                            animate={{ opacity: 1, transform: 'scale(1)' }}
                            exit={{ opacity: 0, transform: 'scale(0)' }}
                        >
                            <span
                                ref={arrowRef}
                                className="border-x-transparent border-t-transparent border-b-white z-10 border-[11px]  -translate-y-full"
                                style={{
                                    position: 'absolute',
                                    left: middlewareData.arrow?.x,
                                    top: middlewareData.arrow?.y,
                                }}
                            />
                            <div className="bg-white relative shadow-md rounded-sm border border-gray-200">
                                <div className="flex flex-col px-2 py-3">
                                    <p className="py-2 px-3 hover:text-orange" >Tiếng Việt</p>
                                    <p className="py-2 px-3 hover:text-orange">English</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </FloatingPortal>


        </Link>
    )
}
