import {prisma} from "@/lib/prisma"

export default async function updateUserRole(userId: string, newRole: UserRole) {
    try{
        const updateUser= await prisma.user.update({
            where: {id: userId},
            data: {user_type: newRole},
    })
        
        return updateUser;
    }catch(error){
        console.error("Error updating user role:", error);
        throw new Error("Failed to update user role");
      }
}