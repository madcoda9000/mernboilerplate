import React from "react"
import { Badge, Stack } from "@chakra-ui/react"

/**
 * @description component to display role badges
 * @param {Array[String]} roles a string array containing user roles
 * @returns {object} a list of badges with role names
 */
const RoleBadges = (roles) => {
    if (roles) {
        return (
            <Stack direction={'row'}>
                {roles.map((role, i) => (
                    <div key={i}>
                        {role === 'admins' ?
                            (
                                <Badge backgroundColor={'red.500'} color={'white'}>{role}</Badge>
                            )
                            :
                            (
                                <Badge display={'inline-flex'} backgroundColor={'blue.500'} color={'white'}>{role}</Badge>
                            )
                        }
                    </div>
                ))}
            </Stack>
        )
    }
}
export default RoleBadges;