import React, { useState } from 'react'
import { CirclePicker, Color, ColorChangeHandler, GithubPicker, SketchPicker, SwatchesPicker, TwitterPicker } from 'react-color'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Palette } from 'lucide-react';

interface ColorPickerProps {
    color: Color | undefined;
    onChange: ColorChangeHandler;
}

const ColorPicker = ({ color, onChange }: ColorPickerProps) => {
    const [showPicker, setShowPicker] = useState(false);
  return (
    <Popover open={showPicker} onOpenChange={setShowPicker}>
        <PopoverTrigger asChild>
            <Button variant={"secondary"} size={"icon"} title='Color' onClick={() => setShowPicker(true)}>
                <Palette size={20}/>
            </Button>
        </PopoverTrigger>
        <PopoverContent className='bg-transparent' align='center'>
            <CirclePicker colors={["#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800", "#777777", "#444444", "#000000"]} color={color} onChange={onChange} />
        </PopoverContent>
    </Popover>
  )
}

export default ColorPicker