import {
    TRANSPARENT,
    WHITE,
    MODEL_BORDER
} from './colors'

export const modelOutContainer = {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:TRANSPARENT
}

export const modelInContainer = {
    justifyContent:'center',
    borderRadius:10,
    backgroundColor:WHITE, 
    width:'80%', 
    borderWidth:1, 
    borderColor:MODEL_BORDER
}