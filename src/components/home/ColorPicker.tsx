import React, { useState, useEffect } from 'react'
import { CirclePicker, Color, ColorChangeHandler, ColorResult } from 'react-color'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Palette } from 'lucide-react';

interface ColorPickerProps {
    color: Color | undefined;
    onChange: (color: ColorResult) => void;
}

const ColorPicker = ({ color, onChange }: ColorPickerProps) => {
    const [showPicker, setShowPicker] = useState(false);
    // const [localColor, setLocalColor] = useState(color || "#2196F3");

    // Update local color when prop changes
    // useEffect(() => {
    //     if (color) {
    //         setLocalColor(color);
    //     }
    // }, [color, ]);

    // const handleColorChange = (colorResult: ColorResult) => {
    //     setLocalColor(colorResult.hex);
    //     onChange(colorResult);
    // };

    // console.log("ColorPicker color", color);

    return (
        <Popover open={showPicker} onOpenChange={setShowPicker}>
            <PopoverTrigger asChild>
                <Button 
                    variant={"secondary"}  
                    // style={{background: localColor as string}} 
                    size={"icon"} 
                    title='Color' 
                    onClick={() => setShowPicker(true)}
                >
                    <Palette size={20}/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className='bg-transparent border-none shadow-none' align='center'>
                <CirclePicker 
                    colors={[
                        "#F44336", "#E91E63", "#9C27B0", "#673AB7", 
                        "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4", 
                        "#009688", "#4CAF50", "#8BC34A", "#CDDC39", 
                        "#FFEB3B", "#FFC107", "#FF9800", "#777777", 
                        "#444444", "#000000"
                    ]} 
                    color={color} 
                    // color={localColor} 
                    onChange={onChange} 
                />
            </PopoverContent>
        </Popover>
    )
}

export default ColorPicker