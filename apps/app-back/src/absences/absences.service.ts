/* eslint-disable prettier/prettier */
import { HttpException, Injectable } from "@nestjs/common";
import { $Enums, Prisma, Status } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AbsencesService {
    constructor(private prisma: PrismaService) {}

    async createAbsence(data: Prisma.AbsencesCreateManyInput) {
        const foundId = await this.prisma.absType.findUnique({
            where: {
                typeId: data.typeId,
            },
        });
        if(foundId){
            await this.prisma.absences.create({ data })
        }else{
            return {recipients: [], sender: "", title: "", error: true}
        }

        // fetch the user who send it
        const user = await this.prisma.personnel.findUnique({
            where : {
                prsId : data.personnelId
            },
            select: {
                email : true,
                supervise : true,
            }
        })


        // We only add id of supervisor
        const emails: string[] = []
        if(user?.supervise === undefined || user.supervise.length <= 0){
            // If undefined or no supervise, take superadmins emails
            const admins = await this.prisma.personnel.findMany({
                where : {
                    role : {
                        has : "SUPERADMIN"
                    }
                },
                select: {
                    email : true
                }
            });

            for(const admin of admins){
                emails.push(admin.email);
            }
        }else{
            // Take supervisors email if there are one or many
            const ids: string[] = [];
            for(const supervision of user.supervise){
                ids.push(supervision.superviseurId);
            }
            
            const rhs = await this.prisma.personnel.findMany({
                where : {
                    prsId : {
                        in : ids
                    }
                },
                select : {
                    email : true
                }
            })

            for(const rh of rhs){
                emails.push(rh.email);
            }
        }

        if(user?.email === undefined){
            return {recipients: [], sender: "", title: "", error: true};
        }

        return {recipients : emails, sender: user?.email, title: data.title, error: false};
    }

    getAbsences() {
        return this.prisma.absences.findMany();
    }

    getAbsenceById(id: string) {
        return this.prisma.absences.findUnique({
            where: {
                absId: id
            },
        });
    }

    getCurrentHoliday(email : string) {
        return this.prisma.absences.findMany({
            where : {
                personnel : {
                    email : email
                },
                status : "ACCEPTER"
            },
        })
    }

    async getAbsenceOwnerById(id: string) {
        const user = await this.prisma.absences.findUnique({
            where : {
                absId : id
            },
            select : {
                personnel : true
            }
        });

        return {status : 200, owner : user?.personnel.email};
    }

    async getUserAbsences(email : string){
        const user = await this.prisma.personnel.findUnique({
            where : {
                email
            },
            select : {
                prsId : true,
                pseudo : true,
                email : true,
                role : true,
                conges : true
            }
        });

        if(user === null) throw new HttpException("Holiday was not found", 404);


        const supervises = await this.getUserSuperviseAbsences(email);

        supervises.push(user);

        return supervises;
    }

    async getUserSuperviseAbsences(email : string){
        // Very if superadmin
        const isSuperAdmin = await this.prisma.personnel.findUnique({
            where : {
                email,
                role : {
                    has: "SUPERADMIN"
                }
            },
        })

        if(isSuperAdmin){
            const users = await this.prisma.personnel.findMany({
                where : {
                    email : {
                        not : email
                    }
                },
                select : {
                    prsId : true,
                    pseudo : true,
                    email : true,
                    role : true,
                    conges : true
                }
            });
            return users;
        }

        const supervisions = await this.prisma.personnel.findUnique({
            where : {
                email
            },
            select : {
                supervisor : true
            }
        });

        const supervises : {
            prsId: string;
            pseudo: string;
            email: string;
            role: string[];
            conges: {
                absId: string;
                title: string;
                typeId: string;
                startDate: Date;
                endDate: Date;
                createAt: Date;
                updateAt: Date;
                status: $Enums.Status;
                commentaire: string;
                personnelId: string;
            }[];
        }[] = [];
        
        if(supervisions?.supervisor !== undefined && supervisions.supervisor.length > 0){
            for(const supervision of supervisions.supervisor){
                const conges = await this.prisma.personnel.findUnique({
                    where : {
                        prsId : supervision.superviseId
                    },
                    select : {
                        prsId : true,
                        pseudo : true,
                        email : true,
                        role: true,
                        conges : true
                    }
                })

                if(conges !== null){
                    supervises.push(conges);
                }
            }
        }

        return supervises;
    }

    async deleteAbsenceById(id: string){
        const findHoliday = await this.getAbsenceById(id);
        if(!findHoliday) throw new HttpException("Holiday was not found", 404);
        return this.prisma.absences.delete({
            where: {
                absId: id
            }
        })
    }

    editAbsence({id, comment, startDate, endDate} : {id : string, comment : string, startDate : string | Date, endDate : string | Date}){
        return this.prisma.absences.update({
            where : {
                absId : id
            },
            data : {
                commentaire : comment,
                startDate : startDate,
                endDate : endDate
            }
        })
    }

    async updateAbsenceById({email, id, comment, status} : {email : string, id : string, comment : string, status : Status}){
        const findHoliday = await this.getAbsenceById(id);
        if(!findHoliday) throw new HttpException("Holiday was not found", 404);

        // Update holiday
        await this.prisma.absences.update({
            where: {
                absId: id
            },
            data : {
                status : status
            }
        })

        // Fetch the email of the recipient
        const user = await this.prisma.absences.findUnique({
            where : {
                absId : id
            },
            select : {
                title : true,
                personnel : true
            }
        })

        if(!user?.personnel && !user?.title) throw new HttpException("No receiver found.", 404);
        const receiver = user.personnel.email;
        const titre = user.title

        const subject = () => {
            if(status === "ACCEPTER"){
                return "Votre demande de congé a été accepté par "+email+" : "+titre
            }

            if(status === "REFUSER"){
                return "Votre demande de congé a été refusé par "+email+" : "+titre
            }

            return "Votre demande de congé a été annulé par "+email+" : "+titre
        }

        return {recipient : receiver, sender : email, subject : subject(), html : comment};
    }
}