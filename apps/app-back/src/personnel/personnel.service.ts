/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { Role } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class PersonnelService {
    constructor(private prisma: PrismaService) {}

    // Return the ID of an user using the email
    getIdByEmail(email: string) {
        return this.prisma.personnel.findUnique({
            where: {
                email
            },
            select: {
                prsId: true
            }
        });
    }

    // Return every users
    getUsers(){
        return this.prisma.personnel.findMany({
            select : {
                prsId: true,
                pseudo : true,
                email : true,
                role: true,
                supervisor: true,
                supervise: true,
                conges: true
            }
        });
    }

    // Update supervisor
    async updateSupervision({supervisorIdList, superviseId} : {supervisorIdList : string[], superviseId : string}){
        // Add every supervision
        for(const supervisorId of supervisorIdList){
            const doesExist = await this.prisma.supervision.findUnique({
                where : {
                    superviseId_superviseurId : {
                        superviseId : superviseId,
                        superviseurId : supervisorId 
                    }
                }
            })

            if(!doesExist){
                await this.prisma.supervision.create({
                    data : {
                        superviseId : superviseId,
                        superviseurId : supervisorId
                    }
                })
            }
        }

        // Remove inexistant supervision
        const allSupervisionRelated = await this.prisma.supervision.findMany({
            where : {
                superviseId: superviseId
            }
        })

        for(const element of allSupervisionRelated){
            const stillExist = supervisorIdList.includes(element.superviseurId);

            if(!stillExist){
                await this.prisma.supervision.delete({
                    where : {
                        superviseId_superviseurId: {
                            superviseId : superviseId,
                            superviseurId : element.superviseurId
                        }
                    }
                })
            }
        }

        return {status : 200, message : "Supervision updated"} //{status : 200, message : "Supervision has been added"}
    }

    // Update roles from a certain user
    updateUserRoles({email, roles} : {email : string, roles : Role[]}){
        return this.prisma.personnel.update({
            where : {
                email: email
            },
            data : {
                role : roles
            }
        })
    }
}