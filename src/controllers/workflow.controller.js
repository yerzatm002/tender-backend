const prisma = require('../prisma/client');

const stepOrder = ['MANAGER', 'LEGAL', 'FINANCE'];

exports.getWorkflow = async (req, res) => {
  const { proposalId } = req.params;

  const workflow = await prisma.approvalWorkflow.findUnique({
    where: { proposalId }
  });

  if (!workflow) return res.status(404).json({ error: 'Workflow not found' });

  res.json(workflow);
};

exports.approveStep = async (req, res) => {
  const { proposalId } = req.params;

  const workflow = await prisma.approvalWorkflow.findUnique({ where: { proposalId } });
  if (!workflow) return res.status(404).json({ error: 'Workflow not found' });

  const nextStepIndex = stepOrder.indexOf(workflow.currentStep) + 1;

  if (nextStepIndex >= stepOrder.length) {
    // Финальное согласование
    await prisma.approvalWorkflow.update({
      where: { proposalId },
      data: {
        isApproved: true,
        approvedAt: new Date()
      }
    });
    await prisma.proposal.update({
      where: { id: proposalId },
      data: { status: 'APPROVED' }
    });
    return res.json({ message: 'Proposal fully approved' });
  }

  const updated = await prisma.approvalWorkflow.update({
    where: { proposalId },
    data: { currentStep: stepOrder[nextStepIndex] }
  });

  res.json({ message: 'Approved step', workflow: updated });
};

exports.rejectProposal = async (req, res) => {
  const { proposalId } = req.params;

  await prisma.approvalWorkflow.update({
    where: { proposalId },
    data: {
      isApproved: false,
      approvedAt: new Date()
    }
  });

  await prisma.proposal.update({
    where: { id: proposalId },
    data: { status: 'REJECTED' }
  });

  res.json({ message: 'Proposal rejected' });
};
