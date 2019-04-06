import {Prisma} from 'prisma-binding';
import { fragmentReplacements } from './resolvers/index'

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: process.env.PRISMA_ENDPOINT,
    secret: 'magicanosecrettest',
    fragmentReplacements
});

// prisma.query prisma.mutation prisma.subscription prisma.exists

export {prisma as default}

const createPostForUser = async (authorId, data) => {
    const userExists = await prisma.exists.User({ id: authorId })

    if (!userExists) {
        throw new Error('User not found')
    }

    const post = await prisma.mutation.createPost({
        data: {
            ...data,
            author: {
                connect: {
                    id: authorId
                }
            }
        }
    }, '{ author { id name email posts { id title published } } }')

    return post.author
}

// createPostForUser('cjtopg0g3k2lr0b91cedo19vv', {
//     title: 'Great books to read',
//     body: 'The War of Art',
//     published: true
// }).then((user) => {
//     console.log(JSON.stringify(user, undefined, 2))
// }).catch((error) => {
//     console.log(error.message)
// })


const updatePostForUser = async (postId, data) => {
    const postExists = await prisma.exists.Post({ id: postId })

    if (!postExists) {
        throw new Error('Post not found')
    }

    const post = await prisma.mutation.updatePost({
        where: {
            id: postId

        },
        data
    }, '{ author { id name email posts { id title published } } }')

    return post.author
}

//id false  cjtoqcshlrokn0b99yh53yfis
// updatePostForUser("cjtoqcshlrokn0b99yh53yfis", { published: true }).then((user) => {
//     console.log(JSON.stringify(user, undefined, 2))
// }).catch((error) => {
//     console.log(error.message)
// })


