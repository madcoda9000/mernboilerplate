import { useEffect, useState } from "react";
import LogsService from "../../Services/LogsService";

/**
 * @description method to dely a search query
 * @param {number} delay the time to delay the action. Default 350ms
 * @returns searchQuery object
 */
export function useSearchDebounce(delay = 350) {
  const [search, setSearch] = useState(null);
  const [searchQuery, setSearchQuery] = useState(null);

  useEffect(() => {
    const delayFn = setTimeout(() => setSearch(searchQuery), delay);
    return () => clearTimeout(delayFn);
  }, [searchQuery, delay]);

  return [search, setSearchQuery];
}

/**
 * @description method to make an audti log entry
 * @param {string} username the username the user who has thrown the audit event
 * @param {string} auditLevel the audit level. Possible leveles: info, warn and error. Default: info
 * @param {string} message the message that shoul be logged
 */
export async function makeAuditEntry(userName,auditLevel='info',message) {
    let payload = {
      user: userName,
      level: auditLevel,
      message: message
    }
    LogsService.createAuditEntry(payload).then((response) => {
      return response;
    });
}