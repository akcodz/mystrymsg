import {z} from 'zod'

export const verifySchema =z.object(
{    code :z.string().length(6,{message:"verification must be of 6 latters"}) }
)