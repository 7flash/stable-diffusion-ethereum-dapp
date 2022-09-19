import React, { useEffect, useRef, useState } from "react";
import { CheckCircleIcon, SettingsIcon } from '@chakra-ui/icons';
import { Heading, VStack, List, ListIcon, ListItem, Box, Button, Input } from '@chakra-ui/react';
import apiPost from 'utils/apiPost';

const baseWidth = 512;
const baseHeight = 512;

const Canvas = ({ canvasRef, boxRef }) => {
    return (
        <Box height="512px" width="512px" bg="gray.100" ref={boxRef}>
            <canvas ref={canvasRef}></canvas>
        </Box>
    );
};

function fillAlpha(ctx, bgColor){  // bgColor is a valid CSS color ctx is 2d context
    // save state
    ctx.save();
    // make sure defaults are set
    ctx.globalAlpha = 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.filter = "none";
 
    // fill transparent pixels with bgColor
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
 
    // cleanup
    ctx.restore();
 }

const useCanvas = () => {
    const canvasRef = useRef();
    const boxRef = useRef();
    const painting = useRef(false);

    useEffect(() => {
        let ctx = canvasRef.current.getContext("2d");
        //Resize Canvas
        canvasRef.current.height = boxRef.current.clientHeight;
        canvasRef.current.width = boxRef.current.clientWidth;

        const startDrawing = e => {
            painting.current = true;
            //
            draw(e);
        };
        const endDrawing = e => {
            painting.current = false;
            //Reset cursor position
            ctx.beginPath();
        };
        const draw = e => {
            if (!painting.current) return;
            ctx.lineWidth = 5;
            ctx.lineCap = "round";
            if (
                e.offsetX <= 0 ||
                e.offsetX >= boxRef.current.clientWidth ||
                e.offsetY <= 0 ||
                e.offsetY >= boxRef.current.clientHeight
            ) {
                return endDrawing(e);
            }
            console.log(e.offsetX, e.offsetY);
            //Draw line
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
        };

        canvasRef.current.addEventListener("mousedown", startDrawing);
        canvasRef.current.addEventListener("mouseup", endDrawing);
        canvasRef.current.addEventListener("mousemove", draw);
    }, []);

    return [canvasRef, boxRef];
};

const galaxyApi = 'https://galaxy-seven-ten.gosleek.xyz/dev'

const headers = {
    "Content-Type": "application/json",
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms ?? 1000))

const getGalaxyPicture = async ({ basePicture, prompt }) => {

    const taskId = await fetch(`${galaxyApi}/tasks`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            in: basePicture,
            prompt: prompt ?? "beautiful",
            width: baseWidth,
            height: baseHeight,
            scale: 2.0,
        })
    }).then(res => res.json()).then(row => row.id);

    const waitingMs = 2500;
    let result = null;

    while (!result) {
        console.log(`waiting ${waitingMs/1000} seconds for ${taskId}...`)
        await sleep(waitingMs);

        await fetch(`${galaxyApi}/tasks/${taskId}`).then(resp => resp.json()).then(task => {
            if (task.out && task.queued == false) {
                result = task.out;
            }
        }).catch(e => { console.log(e.message.substring(10, 20)) });
    }

    return result;
  }


const Create = () => {
    const [inProgress, setInProgress] = useState(false);
    const [outImage, setOutImage] = useState(null);

    const [canvasRef, boxRef] = useCanvas();

    const promptRef = useRef();

    const encodingPrefix = 'data:image/png;base64,';

    const onSubmit = async () => {
        setInProgress(true);

        fillAlpha(canvasRef.current.getContext("2d"), 'white')

        const uri = canvasRef.current.toDataURL("image/png");        
        const firstComma = uri.indexOf(',');
        const basePicture = uri.substring(firstComma + 1);

        // setOutImage(encodingPrefix + basePicture);

        const prompt = promptRef.current.value;

        console.log('prompt', prompt);

        const result = await apiPost('/save-image', {
            basePicture: uri,
        });

        console.log('sss', result);
        
        // const result = await getGalaxyPicture({
        //     basePicture: basePicture,
        //     prompt: prompt,
        // })

        // setOutImage(encodingPrefix + result);

        setInProgress(false);
    }

    return (
        <VStack w={'full'}>
            <Heading size="md" marginBottom={6}>
                Create NFT
            </Heading> 
            <Input type="text" ref={promptRef} placeholder="Add attributes to drawing.." />
            <Canvas canvasRef={canvasRef} boxRef={boxRef} />
            <Button onClick={onSubmit} isActive={!inProgress} title="Generate" isDisabled={inProgress}>
                {inProgress ? "Progressing, wait a minute.." : "Generate New"}
            </Button>
            {
                outImage && <img src={outImage} width={`${baseWidth}px`} height={`${baseHeight}px`} />
            }
        </VStack>
    );
};

export default Create;
