const { MongoDataSource } = require('apollo-datasource-mongodb')
const _ = require('lodash')
const mongoose = require('mongoose')
const cachegoose = require('cachegoose')
const BLAs = require('./BLAs')
const Trades = require('./Trades')
const messages = require('./Messages')
const AccessQueries = require('./MongoAccessQueries')
const { notFound } = require('./Messages')

cachegoose(mongoose)
const DEFAULT_CACHE_TIME = 10

module.exports = class Projects extends MongoDataSource {
  /// ///////////////////
  // internal methods
  getBlaController() {
    return new BLAs(this.projects)
  }

  getTradesController() {
    return new Trades(this.projects, 'Project')
  }

  async getProject(projectId) {
    return this.projects.findById(projectId).exec()
  }

  async findProject(query) {
    return this.projects.findOne(query).exec()
  }

  async createProject(obj) {
    return this.projects.create(obj)
  }

  async getLabourPlanGroup(projectId, labourPlanGroupId) {
    const project = await this.getProject(projectId)
    if (!project || !project.labourPlanGroups) {
      return null
    }
    return project.labourPlanGroups.id(labourPlanGroupId)
  }

  async getProjectByOrgAndCompanySuppliedProjectId(
    organizationId,
    organizationSuppliedProjectId,
  ) {
    const query = {
      organization: mongoose.Types.ObjectId(organizationId),
      organizationSuppliedId: organizationSuppliedProjectId,
    }

    return await this.projects.findOne(query).exec()
  }

  async getProjectByOrgAndCompanySuppliedId(organizationId, companySuppliedId) {
    const query = {
      organization: mongoose.Types.ObjectId(organizationId),
      companySuppliedId,
    }
    return await this.projects.findOne(query).exec()
  }

  async getProjectBySubJobId(subJobId) {
    const query = {
      'subJobs._id': mongoose.Types.ObjectId(subJobId),
    }
    return this.projects.findOne(query).exec()
  }

  // Used interaly, do not expose
  async getLPG(projectId, labourPlanGroupId) {
    const project = await this.getProject(projectId)
    if (!project) {
      return null
    }
    return project.labourPlanGroups.id(labourPlanGroupId)
  }

  /// ///////////////////
  // Project-related  //
  async getProjects({
    projectId,
    organizationId,
    organizationSuppliedId,
    isArchived,
    currentUser,
  } = {}) {
    const PROJECTS = this.projects
    return new Promise((resolve, reject) => {
      const projectArray = []
      return PROJECTS.find(
        AccessQueries.getProjectAccessQuery({
          projectId,
          organizationId,
          organizationSuppliedId,
          isArchived,
          currentUser,
        }),
      )
        .cache(DEFAULT_CACHE_TIME)
        .cursor()
        .on('data', (proj) => {
          projectArray.push(proj)
        })
        .on('end', () => {
          resolve(projectArray)
        })
        .on('error', (err) => {
          console.log({ err })
          reject(null)
        })
    })
  }

  async getProjectsByIds(projectIdsArray) {
    const projectsArray = []
    if (projectIdsArray) {
      for (let i = 0; i < projectIdsArray.length; i++) {
        const project = await this.getProject(projectIdsArray[i])
        if (project) {
          projectsArray.push(project)
        }
      }
    }
    return projectsArray
  }

  async getProjectIdsUsingArchivedProperty(isArchived, organizationId) {
    const mongoResult = await this.projects.aggregate(
      AccessQueries.getProjectIdsFilter({ isArchived, organizationId }),
    )
    if (mongoResult === undefined || mongoResult.length == 0) {
      return null
    }
    return mongoResult[0].project_ids
  }

  async updateProject(projectId, input, currentUser) {
    if (!this.hasWriteAccess(currentUser)) {
      return messages.unauthorized()
    }

    const project = await this.getProject(projectId)
    if (!project) {
      return notFound('Project')
    }

    // Update elements accordingly
    Object.keys(input).forEach((key) => {
      if (input[key]) {
        project[key] = input[key]
      }
    })

    return {
      code: '200',
      success: true,
      message: 'Project details updated',
      project: await project.save(),
    }
  }

  async archiveProject(projectId, isArchived, currentUser) {
    if (!currentUser || !currentUser.isSuperUser) {
      return messages.unauthorized()
    }

    const project = await this.getProject(projectId)
    if (!project) {
      return messages.notFound('Project')
    }

    project.isArchived = isArchived

    return {
      code: 200,
      success: true,
      message: isArchived
        ? 'Successfully archived project'
        : 'Successfully activated project',
      project: await project.save(),
    }
  }

  async getUserRoles(projectId, userId) {
    const roles = []

    const pmQuery = {
      _id: mongoose.Types.ObjectId(projectId),
      projectManagers: mongoose.Types.ObjectId(userId),
    }

    const gfQuery = {
      _id: mongoose.Types.ObjectId(projectId),
      'labourPlanGroups.generalForemen': mongoose.Types.ObjectId(userId),
    }

    const fQuery = {
      _id: mongoose.Types.ObjectId(projectId),
      'labourPlanGroups.labourPlans.foremen': mongoose.Types.ObjectId(userId),
    }

    const pm = await this.projects.findOne(pmQuery).exec()
    const gf = await this.projects.findOne(gfQuery).exec()
    const f = await this.projects.findOne(fQuery).exec()

    if (pm) {
      roles.push('PROJECT_MANAGER')
    }
    if (gf) {
      roles.push('GENERAL_FOREMAN')
    }
    if (f) {
      roles.push('FOREMAN')
    }

    return roles
  }

  async removeProject(id, currentUser) {
    if (!currentUser || !currentUser.isSuperUser) {
      return messages.unauthorized()
    }

    try {
      const project = await this.getProject(id)

      if (project != null) {
        await this.projects.findByIdAndDelete(id)
        return {
          code: '200',
          success: true,
          message: 'Project removed.',
          project,
        }
      }
      return messages.notFound('Project')
    } catch (err) {
      return messages.internalError(err.message)
    }
  }

  async removeProjectManager(projectId, userId, currentUser) {
    if (!this.hasWriteAccess(currentUser)) {
      return messages.unauthorized()
    }

    try {
      const project = await this.getProject(projectId)
      if (project) {
        const existingPM = project.projectManagers.find((pm) => pm == userId)

        if (existingPM) {
          const newPMs = _.filter(
            project.projectManagers,
            (pm) => pm != existingPM,
          )

          project.set('projectManagers', newPMs)
          await project.save()

          if (!(await this.isStillCollaborating(projectId, userId))) {
            const removeResponse = await this.removeCollaborator(
              projectId,
              userId,
              currentUser,
            )
            if (!removeResponse.success) {
              return removeResponse
            }
          }

          return {
            code: '200',
            success: true,
            message: 'PM access removed',
            project,
          }
        }
        return {
          code: '200',
          success: true,
          message: 'PM not a part of project',
          project,
        }
      }
      return messages.notFound('Project')
    } catch (e) {
      return messages.internalError(e.message)
    }
  }

  async getCollaborators(projectId, currentUser) {
    if (!this.hasReadAccess(currentUser)) {
      return null
    }

    const project = await this.getProjects({ projectId, currentUser })
    if (!project) {
      return null
    }
    const projectCollaborators = await this.projects
      .findById(projectId)
      .populate('collaborators')
      .exec()
    return projectCollaborators.collaborators
  }

  async getProjectManagers(project, currentUser) {
    if (!this.hasReadAccess(currentUser)) {
      return []
    }

    if (!project) {
      return []
    }

    const theProject = await this.projects
      .findById(project.id)
      .populate('projectManagers')
      .exec()
    return theProject.projectManagers
  }

  async addCollaborator(projectId, userId, currentUser) {
    if (!this.hasReadAccess(currentUser)) {
      return messages.unauthorized()
    }

    try {
      const project = await this.getProject(projectId)

      const existingCollaborator = project.collaborators.find(
        (c) => c == userId,
      )

      if (existingCollaborator === undefined) {
        project.collaborators.push(mongoose.Types.ObjectId(userId))
        await project.save()
        return {
          code: '200',
          success: true,
          message: 'Collaborator added to project',
          project,
        }
      }
      return {
        code: '200',
        success: true,
        message: 'Collaborator already exists',
        project,
      }
    } catch (e) {
      return {
        code: '500',
        success: false,
        message: e.message,
        project: null,
      }
    }
  }

  async removeCollaborator(projectId, userId, currentUser) {
    if (!this.hasWriteAccess(currentUser)) {
      return messages.unauthorized()
    }
    try {
      const project = await this.getProject(projectId)

      const existingCollaborator = project.collaborators.find(
        (c) => c == userId,
      )

      if (existingCollaborator === undefined) {
        return messages.notFound('User')
      }

      const newCollaborators = _.filter(
        project.collaborators,
        (c) => c != userId,
      )

      project.set('collaborators', newCollaborators)

      await project.save()

      return {
        code: '200',
        success: true,
        message: 'Collaborator removed from project',
        project,
      }
    } catch (e) {
      return {
        code: '500',
        success: false,
        message: e.message,
        project: null,
      }
    }
  }

  /// ///////////////////////////
  // LabourPlanGroup-related  //
  async createLabourPlanGroup(projectId, input, currentUser) {
    if (!this.hasWriteAccess(currentUser)) {
      return messages.unauthorized()
    }
    try {
      const project = await this.getProject(projectId)
      if (!project) {
        return messages.notFound('Project')
      }

      input.trade = input.tradeId // Since it was renamed
      input.name = input.name.trim()

      const existingGroup = _.find(project.labourPlanGroups, (lpg) => {
        if (lpg.subJobId) {
          return lpg.name == input.name && lpg.subJobId.equals(input.subJobId)
        }
        return lpg.name == input.name
      })
      if (existingGroup) {
        if (existingGroup.status != 'PUBLISHED') {
          Object.keys(input).forEach((key) => {
            if (key in input && input[key] !== undefined) {
              if (input[key] == '') {
                existingGroup[key] = null
              } else {
                existingGroup[key] = input[key]
              }
            }
          })
        }

        // allow budget to be udpated from procore webhooks
        if (existingGroup.externalId) {
          if (typeof input.budget !== 'undefined') {
            existingGroup.budget = input.budget
            if (
              Math.abs(input.budget - existingGroup.aedoCalculatedBudget)
              > 0.0001
            ) {
              existingGroup.isBudgetOutOfSync = true
              console.log(`Budget is out of sync for lpg ${existingGroup._id}!`)
            } else {
              existingGroup.isBudgetOutOfSync = false
            }
          }
        } else if (typeof input.budget !== 'undefined') {
          existingGroup.aedoCalculatedBudget = existingGroup.budget = input.budget
          existingGroup.isBudgetOutOfSync = false
        }
        await project.save()

        const message = existingGroup.status != 'PUBLISHED'
          ? 'Labour Plan Group already exists and was updated'
          : 'Labour Plan Group already exists, not updated as Published'
        return {
          code: '200',
          success: true,
          message,
          projectId: project.id,
          labourPlanGroup: existingGroup,
        }
      }
      // when creating lpg for the first time aedo budget=procore budget
      const newLpgInput = { ...input }
      newLpgInput.aedoCalculatedBudget = newLpgInput.budget
      newLpgInput.isBudgetOutOfSync = false
      const newGroup = project.labourPlanGroups.create(newLpgInput)
      newGroup.aedoCalculatedBudget = newGroup.budget
      newGroup.isBudgetOutOfSync = false
      project.labourPlanGroups.push(newGroup)
      await project.save()

      return {
        code: '200',
        success: true,
        message: 'Labour Plan group created',
        projectId: project.id,
        labourPlanGroup: newGroup,
      }
    } catch (e) {
      return messages.internalError(e.message)
    }
  }

  async removeLabourPlanGroup(projectId, labourPlanGroupId, currentUser) {
    if (!this.hasWriteAccess(currentUser)) {
      return messages.unauthorized()
    }

    const project = await this.getProject(projectId)
    if (!project) {
      return messages.notFound('Project')
    }

    const labourPlanGroup = project.labourPlanGroups.id(labourPlanGroupId)
    if (!labourPlanGroup) {
      return messages.notFound('LabourPlanGroup')
    }

    if (labourPlanGroup.status != 'PLANNING' && !currentUser.isSuperUser) {
      return messages.operationNotAllowed(
        'Can only remove a Labour Plan when in PLANNING status',
      )
    }

    const filteredLabourPlanGroups = _.filter(
      project.labourPlanGroups,
      (c) => c.id != labourPlanGroupId,
    )

    project.set('labourPlanGroups', filteredLabourPlanGroups)

    await project.save()

    return {
      code: '200',
      success: true,
      message: 'Labour Plan Group Removed',
      projectId: project.id,
      labourPlanGroup,
    }
  }

  async getLabourPlanGroups(projectId, labourPlanGroupId, currentUser) {
    if (!this.hasReadAccess(currentUser)) {
      return null
    }
    const project = await this.getProject(projectId)
    if (!project) {
      return null
    }

    return labourPlanGroupId
      ? [project.labourPlanGroups.id(labourPlanGroupId)]
      : project.labourPlanGroups
  }

  async updateLabourPlanGroupDetails(
    projectId,
    labourPlanGroupId,
    input,
    currentUser,
    orgSettingOverride = false,
  ) {
    if (!this.hasWriteAccess(currentUser)) {
      return messages.unauthorized()
    }

    try {
      const project = await this.getProject(projectId)
      if (!project) {
        return messages.notFound('Project')
      }

      const labourPlanGroup = project.labourPlanGroups.id(labourPlanGroupId)
      if (!labourPlanGroup) {
        return messages.notFound('LabourPlanGroup')
      }

      if (
        labourPlanGroup.status == 'PUBLISHED'
        && !currentUser.isSuperUser
        && !orgSettingOverride
      ) {
        return messages.operationNotAllowed(
          'Cannot update once PUBLISHED. Adjustable setting.',
        )
      }

      input.trade = input.tradeId // since it was renamed

      // Update elements accordingly
      Object.keys(input).forEach((key) => {
        if (typeof input[key] !== 'undefined') {
          labourPlanGroup[key] = input[key]
        }
      })

      if (
        typeof input.budget !== 'undefined'
        && labourPlanGroup.aedoCalculatedBudget
        && Math.abs(input.budget - labourPlanGroup.aedoCalculatedBudget) > 0.0001
      ) {
        // the user must contact aedo before proceeding with any budgeting work in aedo LPP
        labourPlanGroup.isBudgetOutOfSync = true
      } else {
        labourPlanGroup.isBudgetOutOfSync = false
      }
      const l = await project.save()
      console.log(l)
      console.log('-------------------------------')

      return {
        code: '200',
        success: true,
        message: 'LabourPlanGroup details updated',
        labourPlanGroup: project.labourPlanGroups.id(labourPlanGroupId),
      }
    } catch (e) {
      console.log('-----------------------------------------------')
      console.log(e)
      return messages.internalError(e.message)
    }
  }

  async updateLabourPlanGroupStatus(input, currentUser) {
    if (!this.hasWriteAccess(currentUser)) {
      return messages.unauthorized()
    }

    try {
      const project = await this.getProject(input.projectId)
      if (!project) {
        return messages.notFound('Project')
      }

      const labourPlanGroup = project.labourPlanGroups.id(
        input.labourPlanGroupId,
      )

      if (!labourPlanGroup) {
        return messages.notFound('Labour Plan Group')
      }

      if (input.status != 'PUBLISHED') {
        return messages.operationNotAllowed(
          'Can only publish labour plan groups. And only once!',
        )
      }

      if (
        labourPlanGroup.externalId
        && (!labourPlanGroup.budgetedRate || labourPlanGroup.budgetedRate == 0)
      ) {
        return messages.operationNotAllowed('BudgetedRate must be set.')
      }

      // only matters if there's a summary code for this lpg (i.e. externalId is set)
      if (
        labourPlanGroup.externalId
        && input.statistics
        && input.statistics.totalBudgetHours
        && input.statistics.totalBudgetHours
          > labourPlanGroup.budget / labourPlanGroup.budgetedRate
      ) {
        return messages.operationNotAllowed(
          'Cannot publish if over allocated budget',
        )
      }

      if (labourPlanGroup.labourPlans.length == 0) {
        return messages.operationNotAllowed(
          "There are no labour plans in this group, can't Publish.",
        )
      }

      labourPlanGroup.status = input.status
      const { labourPlans } = labourPlanGroup

      for (let i = 0; i < labourPlans.length; i++) {
        labourPlans[i].status = 'ACTIVE'
      }

      await project.save()
      return {
        code: '200',
        success: true,
        message: 'Labour Plan Group Published',
        projectId: project.id,
        labourPlanGroup,
      }
    } catch (e) {
      return messages.internalError(e.message)
    }
  }

  async setIntegrationToggle(projectId, hasActiveIntegration, currentUser) {
    if (!currentUser || !currentUser.isSuperUser) {
      return messages.unauthorized()
    }
    try {
      const project = await this.getProject(projectId)
      project.hasActiveIntegration = hasActiveIntegration

      return {
        code: 200,
        success: true,
        message: `Project integration toggle now set to ${hasActiveIntegration}`,
        project: await project.save(),
      }
    } catch (e) {
      return messages.internalError(e.message)
    }
  }

  async addGeneralForeman(projectId, labourPlanGroupId, userId, currentUser) {
    if (!this.hasWriteAccess(currentUser)) {
      return messages.unauthorized()
    }

    const collabResponse = await this.addCollaborator(
      projectId,
      userId,
      currentUser,
    )
    if (!collabResponse.success) {
      return collabResponse
    }

    try {
      const project = await this.getProject(projectId)

      if (project) {
        const labourPlanGroup = project.labourPlanGroups.id(labourPlanGroupId)

        if (labourPlanGroup) {
          const existingGenForeman = labourPlanGroup.generalForemen.find(
            (user) => user == userId,
          )

          if (existingGenForeman) {
            return {
              code: '200',
              success: true,
              message: 'General Foreman already exists',
              projectId: project.id,
              labourPlanGroup,
            }
          }
          labourPlanGroup.generalForemen.push(mongoose.Types.ObjectId(userId))
          await project.save()
          return {
            code: '200',
            success: true,
            message: 'General Foreman Added',
            projectId: project.id,
            labourPlanGroup,
          }
        }
        return messages.notFound('Labour Plan Group')
      }
      return messages.notFound('Project')
    } catch (e) {
      return messages.internalError(e.message)
    }
  }

  async removeGeneralForeman(
    projectId,
    labourPlanGroupId,
    userId,
    currentUser,
  ) {
    if (!this.hasWriteAccess(currentUser)) {
      return messages.unauthorized()
    }

    try {
      const project = await this.getProject(projectId)

      if (project) {
        const labourPlanGroup = project.labourPlanGroups.id(labourPlanGroupId)

        if (labourPlanGroup) {
          const currentForemen = labourPlanGroup.generalForemen.find(
            (user) => user == userId,
          )

          if (currentForemen) {
            const newGenForemen = _.filter(
              labourPlanGroup.generalForemen,
              (foreman) => foreman != userId,
            )

            labourPlanGroup.set('generalForemen', newGenForemen)
            await project.save()

            if (!(await this.isStillCollaborating(projectId, userId))) {
              const removeResponse = await this.removeCollaborator(
                projectId,
                userId,
                currentUser,
              )
              if (!removeResponse.success) {
                return removeResponse
              }
            }

            return {
              code: '200',
              success: true,
              message: 'General Foreman Removed',
              projectId: project.id,
              labourPlanGroup,
            }
          }
          return messages.notFound('General Foreman')
        }
        return messages.notFound('Labour Plan Group')
      }
      return messages.notFound('Project')
    } catch (e) {
      return messages.internalError(e.message)
    }
  }

  async updateTradeAtLPGLevel(
    projectId,
    labourPlanGroupId,
    tradeId,
    currentUser,
  ) {
    if (!this.hasWriteAccess(currentUser)) {
      return messages.unauthorized()
    }

    try {
      const project = await this.getProject(projectId)

      if (project) {
        const labourPlanGroup = project.labourPlanGroups.id(labourPlanGroupId)

        if (labourPlanGroup) {
          labourPlanGroup.trade = tradeId
          await project.save()

          return {
            code: '200',
            success: true,
            message: 'Trade set to at LabourPlanGroup level',
            projectId: project.id,
            labourPlanGroup,
          }
        }
        return messages.notFound('Labour Plan Group')
      }
      return messages.notFound('Project')
    } catch (e) {
      return messages.internalError(e.message)
    }
  }

  /// /////////////////////
  // Snapshot-related  //

  async addSnapshot(projectId, input, currentUser) {
    try {
      if (!this.hasWriteAccess(currentUser)) {
        return messages.unauthorized()
      }

      const project = await this.getProject(mongoose.Types.ObjectId(projectId))
      if (!project) {
        return messages.notFound('Project')
      }

      const newSnapshot = await project.snapshots.create({
        owner: mongoose.Types.ObjectId(currentUser.id),
        name: input.name,
        details: input.details,
        created: Date.now(),
      })

      await project.snapshots.push(newSnapshot)

      await project.save()
      return {
        success: true,
        code: 200,
        message: 'Successfully created Snapshot',
        snapshot: newSnapshot,
        projectId,
      }
    } catch (e) {
      return messages.internalError(e.message)
    }
  }

  async removeSnapshot(projectId, snapshotId, currentUser) {
    try {
      if (!this.hasWriteAccess(currentUser)) {
        return messages.unauthorized()
      }

      const project = await this.getProject(mongoose.Types.ObjectId(projectId))
      if (!project) {
        return messages.notFound('Project')
      }

      const snapshot = project.snapshots.find(
        (snapshot) => snapshot.id == snapshotId,
      )
      if (!snapshot) {
        return {
          success: true,
          code: 200,
          message: "Snapshot doesn't exist",
          projectId,
        }
      }

      if (snapshot.owner != currentUser.id && !currentUser.isSuperUser) {
        return messages.operationNotAllowed(
          'Only owners and administrators can remove snapshots',
        )
      }

      const newSnapshots = _.filter(
        project.snapshots,
        (snapshot) => snapshot.id != snapshotId,
      )

      project.set('snapshots', newSnapshots)
      await project.save()

      return {
        code: 200,
        success: true,
        message: 'Snapshot removed',
        projectId,
        snapshot,
      }
    } catch (e) {
      return messages.internalError(e.message)
    }
  }

  async updateSnapshot(projectId, snapshotId, input, currentUser) {
    try {
      if (!this.hasWriteAccess(currentUser)) {
        return messages.unauthorized()
      }

      const project = await this.getProject(mongoose.Types.ObjectId(projectId))
      if (!project) {
        return messages.notFound('Project')
      }

      const snapshot = project.snapshots.find(
        (snapshot) => snapshot.id == snapshotId,
      )
      if (!snapshot) {
        return messages.notFound('Snapshot')
      }

      if (input.name) {
        snapshot.name = input.name
      }

      if (input.details) {
        snapshot.details = input.details
      }

      await project.save()

      return {
        success: true,
        code: 200,
        message: 'Snapshot updated',
        snapshot,
        projectId,
      }
    } catch (e) {
      return messages.internalError(e.message)
    }
  }

  /// ///////////////////////
  // LabourPlan-related  //
  async createLabourPlan(projectId, labourPlanGroupId, input, currentUser) {
    if (!this.hasWriteAccess(currentUser)) {
      return messages.unauthorized()
    }

    try {
      const project = await this.getProject(projectId)
      if (project) {
        const labourPlanGroup = project.labourPlanGroups.id(labourPlanGroupId)

        if (labourPlanGroup) {
          const { labourPlans } = labourPlanGroup
          const labourPlan = labourPlans.create(input)
          labourPlans.push(labourPlan)
          await project.save()

          return {
            code: '200',
            success: true,
            message: 'Labour Plan created',
            projectId: project.id,
            labourPlanGroupId,
            labourPlan,
          }
        }
        return messages.notFound('Labour Plan Group')
      }
      return messages.notFound('Project')
    } catch (e) {
      return messages.internalError(e.message)
    }
  }

  async removeLabourPlan(
    projectId,
    labourPlanGroupId,
    labourPlanId,
    currentUser,
    isEmpty = false,
  ) {
    if (!this.hasWriteAccess(currentUser)) {
      return messages.unauthorized()
    }
    const project = await this.getProject(projectId)
    if (!project) {
      return messages.notFound('Project')
    }

    const labourPlanGroup = project.labourPlanGroups.id(labourPlanGroupId)
    if (!labourPlanGroup) {
      return messages.notFound('LabourPlanGroup')
    }

    const toRemoveLabourPlan = labourPlanGroup.labourPlans.id(labourPlanId)

    if (!toRemoveLabourPlan) {
      return messages.notFound('Labour Plan')
    }

    if (
      toRemoveLabourPlan.status != 'PLANNING'
      && !currentUser.isSuperUser
      && !isEmpty
    ) {
      return messages.operationNotAllowed(
        'Can only remove a Labour Plan when in PLANNING status',
      )
    }

    const filteredLabourPlans = _.filter(
      labourPlanGroup.labourPlans,
      (c) => c.id != labourPlanId,
    )

    labourPlanGroup.set('labourPlans', filteredLabourPlans)

    await project.save()

    return {
      code: '200',
      success: true,
      message: 'Labour Plan Removed',
      projectId: project.id,
      labourPlanGroupId,
      labourPlan: toRemoveLabourPlan,
    }
  }

  async updateLabourPlanDetails(
    projectId,
    labourPlanGroupId,
    labourPlanId,
    input,
    currentUser,
  ) {
    if (!this.hasWriteAccess(currentUser)) {
      return messages.unauthorized()
    }

    try {
      const project = await this.getProject(projectId)
      if (!project) {
        return messages.notFound('Project')
      }

      const labourPlanGroup = project.labourPlanGroups.id(labourPlanGroupId)

      if (!labourPlanGroup) {
        return messages.notFound('LabourPlanGroup')
      }

      const labourPlan = labourPlanGroup.labourPlans.id(labourPlanId)

      if (!labourPlan) {
        return messages.notFound('LabourPlan')
      }

      if (labourPlan.status == 'ACTIVE' && !currentUser.isSuperUser) {
        return messages.operationNotAllowed('Cannot update while ACTIVE')
      }

      // Update elements accordingly
      Object.keys(input).forEach((key) => {
        if (input[key]) {
          labourPlan[key] = input[key]
        }
      })

      await project.save()

      return {
        code: '200',
        success: true,
        message: 'LabourPlan details updated',
        labourPlan,
        labourPlanGroupId,
        projectId,
      }
    } catch (e) {
      return messages.internalError(e.message)
    }
  }

  async getLabourPlans(
    projectId,
    labourPlanGroupId,
    labourPlanId,
    currentUser,
  ) {
    if (!this.hasReadAccess(currentUser)) {
      return null
    }

    const project = await this.getProject(projectId)
    if (!project) {
      return null
    }

    const labourPlanGroup = project.labourPlanGroups.id(labourPlanGroupId)
    if (!labourPlanGroup) {
      return null
    }

    return labourPlanId
      ? [labourPlanGroup.labourPlans.id(labourPlanId)]
      : labourPlanGroup.labourPlans
  }

  async getLabourPlan(projectId, labourPlanGroupId, labourPlanId, currentUser) {
    const project = await this.getProject(projectId)
    return (
      project.labourPlanGroups.id(labourPlanGroupId)
      && project.labourPlanGroups
        .id(labourPlanGroupId)
        .labourPlans.id(labourPlanId)
    )
  }

  async updateLabourPlanStatus(
    projectId,
    labourPlanGroupId,
    labourPlanId,
    status,
    currentUser,
    labourPlanStatistics,
  ) {
    if (!this.hasWriteAccess(currentUser)) {
      return messages.unauthorized()
    }

    // TODO - This code assumes that the only status change is switching the LP to published!?

    try {
      const project = await this.getProject(projectId)
      if (!project) {
        return messages.notFound('Project')
      }

      const labourPlanGroup = project.labourPlanGroups.id(labourPlanGroupId)
      if (!labourPlanGroup) {
        return messages.notFound('Labour Plan Group')
      }

      const labourPlan = labourPlanGroup.labourPlans.id(labourPlanId)
      if (!labourPlan) {
        return messages.notFound('Labour Plan')
      }

      if (
        labourPlanGroup.budget != labourPlanGroup.aedoCalculatedBudget
        || labourPlanGroup.isBudgetOutOfSync
      ) {
        return messages.operationNotAllowed(
          'Budgets are out of sync. Cannot publish',
        )
      }

      const remainingBudget = labourPlanGroup.budget
        - labourPlanStatistics.originalBudgetHours * labourPlanGroup.budgetedRate
      if (labourPlanGroup.externalId && remainingBudget < 0) {
        return messages.operationNotAllowed(
          `Labour Plan ${labourPlan.id} goes over budget by ${
            remainingBudget * -1
          }`,
        )
      }

      if (status === 'ACTIVE' && labourPlan.status !== 'ACTIVE') {
        labourPlan.publishedAt = Date.now()
      }

      labourPlan.status = status

      labourPlanGroup.aedoCalculatedBudget = Math.max(
        labourPlanGroup.budget
          - labourPlanStatistics.originalBudgetHours
            * labourPlanGroup.budgetedRate,
        0,
      )

      if (!labourPlanGroup.externalId) {
        labourPlanGroup.budget = labourPlanGroup.aedoCalculatedBudget
      }

      await project.save()

      return {
        code: '200',
        success: true,
        message: 'Status updated',
        projectId: project.id,
        labourPlanGroupId,
        labourPlan,
      }
    } catch (e) {
      return messages.internalError(e.message)
    }
  }

  async addForemanToLabourPlan(
    projectId,
    labourPlanGroupId,
    labourPlanId,
    userId,
    currentUser,
  ) {
    if (!this.hasWriteAccess(currentUser)) {
      return messages.unauthorized()
    }
    try {
      const collabResponse = await this.addCollaborator(
        projectId,
        userId,
        currentUser,
      )
      if (!collabResponse.success) {
        return collabResponse
      }

      const project = await this.getProject(projectId)

      if (project) {
        const labourPlanGroup = project.labourPlanGroups.id(labourPlanGroupId)

        if (labourPlanGroup) {
          const labourPlan = labourPlanGroup.labourPlans.id(labourPlanId)

          if (
            labourPlan
            && !_.find(labourPlan.foremen, mongoose.Types.ObjectId(userId))
          ) {
            labourPlan.foremen.push(mongoose.Types.ObjectId(userId))
            await project.save()
          }
          return {
            code: '200',
            success: true,
            message: 'Labour Plan Foreman added',
            projectId: project.id,
            labourPlanGroupId,
            labourPlan,
          }
        }
        return messages.notFound('Labour Plan Group')
      }
      return messages.notFound('Project')
    } catch (e) {
      return messages.internalError(e.message)
    }
  }

  async removeForemanFromLabourPlan(
    projectId,
    labourPlanGroupId,
    labourPlanId,
    userId,
    currentUser,
  ) {
    if (!this.hasWriteAccess(currentUser)) {
      return messages.unauthorized()
    }

    try {
      const project = await this.getProject(projectId)

      if (project) {
        const labourPlanGroup = project.labourPlanGroups.id(labourPlanGroupId)

        if (labourPlanGroup) {
          const labourPlan = labourPlanGroup.labourPlans.id(labourPlanId)

          if (labourPlan) {
            const newForemen = _.filter(labourPlan.foremen, (m) => m != userId)

            labourPlan.set('foremen', newForemen)
            await project.save()

            if (!(await this.isStillCollaborating(projectId, userId))) {
              const removeResponse = await this.removeCollaborator(
                projectId,
                userId,
                currentUser,
              )
              if (!removeResponse.success) {
                return removeResponse
              }
            }

            return {
              code: '200',
              success: true,
              message: 'Labour Plan Foreman removed',
              projectId: project.id,
              labourPlanGroupId,
              labourPlan,
            }
          }
          return message.notFound('Labour Plan')
        }
        return messages.notFound('Labour Plan Group')
      }
      return messages.notFound('Project')
    } catch (e) {
      return messages.internalError(e.message)
    }
  }

  async updateBlendedRateFromLabourPlan(
    projectId,
    labourPlanGroupId,
    labourPlanId,
    newRate,
    currentUser,
  ) {
    if (!this.hasWriteAccess(currentUser)) {
      return messages.unauthorized()
    }

    try {
      const project = await this.getProject(projectId)
      if (!project) {
        return messages.notFound('Project')
      }

      const labourPlanGroup = project.labourPlanGroups.id(labourPlanGroupId)
      if (!labourPlanGroup) {
        return messages.notFound('LabourPlanGroup')
      }

      const labourPlan = labourPlanGroup.labourPlans.id(labourPlanId)
      if (!labourPlan) {
        return messages.notFound('LabourPlan')
      }

      labourPlan.blendedRate = newRate
      await project.save()

      return {
        code: '200',
        success: true,
        message: 'Blended rate updated',
        projectId: project.id,
        labourPlanGroupId,
        labourPlan,
      }
    } catch (e) {
      return messages.internalError(e.message)
    }
  }

  async isStillCollaborating(projectOrProjectId, userId) {
    let project = null
    if (!(projectOrProjectId instanceof mongoose.Model)) {
      project = await this.getProject(projectOrProjectId)
    } else {
      project = projectOrProjectId
    }

    // Are they a PM?
    if (project.projectManagers.includes(userId)) {
      return true
    }

    // Are they a generalForeman?
    for (let i = 0; i < project.labourPlanGroups.length; i += 1) {
      if (project.labourPlanGroups[i].generalForemen.includes(userId)) {
        return true
      }

      // Are they a foreman?
      for (
        let j = 0;
        j < project.labourPlanGroups[i].labourPlans.length;
        j += 1
      ) {
        if (
          project.labourPlanGroups[i].labourPlans[j].foremen.includes(userId)
        ) {
          return true
        }
      }
    }

    // Are they a buildingForeman?
    for (let i = 0; i < project.buildings.length; i += 1) {
      if (project.buildings[i].buildingForemen.includes(userId)) {
        return true
      }

      // Are they a levelForeman?
      for (let j = 0; j < project.buildings[i].levels.length; j += 1) {
        if (project.buildings[i].levels[j].levelForemen.includes(userId)) {
          return true
        }

        // Are they a areaForeman?
        for (
          let k = 0;
          k < project.buildings[i].levels[j].areas.length;
          k += 1
        ) {
          if (
            project.buildings[i].levels[j].areas[k].areaForemen.includes(userId)
          ) {
            return true
          }
        }
      }
    }
    // If not anywhere else, then no longer in project
    return false
  }

  async addForemanToBuilding(projectId, buildingId, userId, currentUser) {
    if (!this.hasWriteAccess(currentUser)) {
      return messages.unauthorized()
    }

    const collabResponse = await this.addCollaborator(
      projectId,
      userId,
      currentUser,
    )
    if (!collabResponse.success) {
      return collabResponse
    }

    try {
      const project = await this.getProject(projectId)

      if (project) {
        const building = project.buildings.id(buildingId)

        if (building) {
          const existingBuildingForeman = building.buildingForemen.find(
            (user) => user == userId,
          )

          if (existingBuildingForeman) {
            return {
              code: '200',
              success: true,
              message: 'Building Foreman already exists',
              projectId: project.id,
              building,
            }
          }
          building.buildingForemen.push(mongoose.Types.ObjectId(userId))
          await project.save()
          return {
            code: '200',
            success: true,
            message: 'Building Foreman Added',
            projectId: project.id,
            building,
          }
        }
        return messages.notFound('Building')
      }
      return messages.notFound('Project')
    } catch (e) {
      return messages.internalError(e.message)
    }
  }

  async addForemanToLevel(projectId, buildingId, levelId, userId, currentUser) {
    if (!this.hasWriteAccess(currentUser)) {
      return messages.unauthorized()
    }

    try {
      const collabResponse = await this.addCollaborator(
        projectId,
        userId,
        currentUser,
      )
      if (!collabResponse.success) {
        return collabResponse
      }

      const project = await this.getProject(projectId)

      if (project) {
        const building = project.buildings.id(buildingId)

        if (building) {
          const level = building.levels.id(levelId)

          if (
            level
            && !_.find(level.levelForemen, mongoose.Types.ObjectId(userId))
          ) {
            level.levelForemen.push(mongoose.Types.ObjectId(userId))
            await project.save()
          }
          return {
            code: '200',
            success: true,
            message: 'Level Foreman added',
            projectId: project.id,
            buildingId,
            level,
          }
        }
        return messages.notFound('Level')
      }
      return messages.notFound('Project')
    } catch (e) {
      return messages.internalError(e.message)
    }
  }

  async addForemanToArea(
    projectId,
    buildingId,
    levelId,
    areaId,
    userId,
    currentUser,
  ) {
    if (!this.hasWriteAccess(currentUser)) {
      return messages.unauthorized()
    }

    try {
      const collabResponse = await this.addCollaborator(
        projectId,
        userId,
        currentUser,
      )
      if (!collabResponse.success) {
        return collabResponse
      }

      const project = await this.getProject(projectId)

      if (project) {
        const building = project.buildings.id(buildingId)

        if (building) {
          const level = building.levels.id(levelId)

          if (level) {
            const area = level.areas.id(areaId)

            if (
              area
              && !_.find(area.areaForemen, mongoose.Types.ObjectId(userId))
            ) {
              area.areaForemen.push(mongoose.Types.ObjectId(userId))
              await project.save()
            }
            return {
              code: '200',
              success: true,
              message: 'Area Foreman added',
              projectId: project.id,
              buildingId,
              levelId,
              area,
            }
          }
          return messages.notFound('Area')
        }
        return messages.notFound('Level')
      }
      return messages.notFound('Project')
    } catch (e) {
      return messages.internalError(e.message)
    }
  }

  async removeForemanFromBuilding(projectId, buildingId, userId, currentUser) {
    if (!this.hasWriteAccess(currentUser)) {
      return messages.unauthorized()
    }

    try {
      const project = await this.getProject(projectId)

      if (project) {
        const building = project.buildings.id(buildingId)

        if (building) {
          const currentForemen = building.buildingForemen.find(
            (user) => user == userId,
          )

          if (currentForemen) {
            const newBuildingForemen = _.filter(
              building.buildingForemen,
              (foreman) => foreman != userId,
            )

            building.set('buildingForemen', newBuildingForemen)
            await project.save()

            if (!(await this.isStillCollaborating(projectId, userId))) {
              const removeResponse = await this.removeCollaborator(
                projectId,
                userId,
                currentUser,
              )
              if (!removeResponse.success) {
                return removeResponse
              }
            }

            return {
              code: '200',
              success: true,
              message: 'Building Foreman Removed',
              projectId: project.id,
              building,
            }
          }
          return messages.notFound('Building Foreman')
        }
        return messages.notFound('Building')
      }
      return messages.notFound('Project')
    } catch (e) {
      return messages.internalError(e.message)
    }
  }

  async removeForemanFromLevel(
    projectId,
    buildingId,
    levelId,
    userId,
    currentUser,
  ) {
    if (!this.hasWriteAccess(currentUser)) {
      return messages.unauthorized()
    }

    try {
      const project = await this.getProject(projectId)

      if (project) {
        const building = project.buildings.id(buildingId)

        if (building) {
          const level = building.levels.id(levelId)

          if (level) {
            const currentForemen = level.levelForemen.find(
              (user) => user == userId,
            )

            if (currentForemen) {
              const newLevelForemen = _.filter(
                level.levelForemen,
                (m) => m != userId,
              )

              level.set('levelForemen', newLevelForemen)
              await project.save()

              if (!(await this.isStillCollaborating(projectId, userId))) {
                const removeResponse = await this.removeCollaborator(
                  projectId,
                  userId,
                  currentUser,
                )
                if (!removeResponse.success) {
                  return removeResponse
                }
              }

              return {
                code: '200',
                success: true,
                message: 'Level Foreman removed',
                projectId: project.id,
                buildingId,
                level,
              }
            }
            return messages.notFound('levelForemen')
          }
          return messages.notFound('Level')
        }
        return messages.notFound('Building')
      }
      return messages.notFound('Project')
    } catch (e) {
      return messages.internalError(e.message)
    }
  }

  async removeForemanFromArea(
    projectId,
    buildingId,
    levelId,
    areaId,
    userId,
    currentUser,
  ) {
    if (!this.hasWriteAccess(currentUser)) {
      return messages.unauthorized()
    }

    try {
      const project = await this.getProject(projectId)

      if (project) {
        const building = project.buildings.id(buildingId)

        if (building) {
          const level = building.levels.id(levelId)

          if (level) {
            const area = level.areas.id(areaId)

            if (area) {
              const currentForemen = area.areaForemen.find(
                (user) => user == userId,
              )

              if (currentForemen) {
                const newAreaForemen = _.filter(
                  area.areaForemen,
                  (m) => m != userId,
                )

                area.set('areaForemen', newAreaForemen)
                await project.save()

                if (!(await this.isStillCollaborating(projectId, userId))) {
                  const removeResponse = await this.removeCollaborator(
                    projectId,
                    userId,
                    currentUser,
                  )
                  if (!removeResponse.success) {
                    return removeResponse
                  }
                }

                return {
                  code: '200',
                  success: true,
                  message: 'Area Foreman removed',
                  projectId: project.id,
                  buildingId,
                  levelId,
                  area,
                }
              }
              return messages.notFound('areaForemen')
            }
            return messages.notFound('Area')
          }
          return messages.notFound('Level')
        }
        return messages.notFound('Building')
      }
      return messages.notFound('Project')
    } catch (e) {
      return messages.internalError(e.message)
    }
  }

  hasReadAccess(currentUser) {
    if (currentUser && !currentUser.isAnonymous) {
      return true
    }
    return false
  }

  hasWriteAccess(currentUser) {
    if (
      currentUser
      && !currentUser.isAnonymous
      && (currentUser.roles.includes('PROJECT_MANAGER')
        || currentUser.roles.includes('EXECUTIVE')
        || currentUser.isSuperUser)
    ) {
      return true
    }
    return false
  }
}
