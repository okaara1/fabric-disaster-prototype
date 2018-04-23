import { enrollAdmin } from './enroll-admin'
import { registerUser } from './register-user'
export { HealthRecordQueries } from './query'
export { HealthRecordInvokes } from './invoke'

export let FabricDAO = {
  enrollAdmin, 
  registerUser,
  // queryAllRecords,
  // queryRecordById,
  // createRecord
}

// import { queryAllRecords, queryRecordById, HealthRecordQueries } from './query'
// import { createRecord } from './invoke'