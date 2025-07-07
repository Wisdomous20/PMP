"use server";

import client from "@/lib/database/client";
import {ErrorCodes} from "@/lib/ErrorCodes";
import type {GenericFailureType} from "@/lib/types/GenericFailureType";
import {Prisma} from "@prisma/client";

const personnelFindManyQuery = Prisma.validator<Prisma.PersonnelFindManyArgs>()({
  include: {
    assignments: {
      include: {
        task: true,
      },
    },
  },
});

export interface Personnel extends Prisma.PersonnelGetPayload<typeof personnelFindManyQuery> {
  tasks: Array<{
    id: string;
    title: string;
    start: Date;
    end: Date;
  }>;
}

interface GetPersonnelResult extends GenericFailureType {
  data?: Array<Personnel>;
}

export async function getPersonnel(): Promise<GetPersonnelResult> {
  const personnel = await client.personnel.findMany(personnelFindManyQuery);

  return {
    code: ErrorCodes.OK,
    data: personnel.map((person) => {
      const tasks = person.assignments.map((assignment) => ({
        id: assignment.task.id,
        title: assignment.task.name,
        start: assignment.task.startTime,
        end: assignment.task.endTime,
      }));
      return {
        ...person,
        tasks,
      };
    }),
  }
}
