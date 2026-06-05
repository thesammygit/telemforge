import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { buildReviewObservationHandoffPath } from "../../frontend/src/lib/reviewObservationHandoffPath.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildReviewObservationHandoffPath derives ordered path steps from the Stage 41 agenda", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const agenda = view.reviewObservationHandoffAgenda;
  const handoffPath = buildReviewObservationHandoffPath(agenda);

  assert.ok(agenda);
  assert.ok(handoffPath);
  assert.equal(
    handoffPath.schema,
    "telemforge.review_observation_handoff_path.v1",
  );
  assert.equal(handoffPath.version, 1);
  assert.equal(
    handoffPath.contractLabel,
    "local deterministic observation handoff path and static anchor map",
  );
  assert.equal(handoffPath.localStatus, "fixture");
  assert.strictEqual(handoffPath.sourceObservationHandoffAgenda, agenda);
  assert.equal(
    handoffPath.summary.defaultPathStepId,
    handoffPath.defaultPathStep.pathStepId,
  );
  assert.equal(
    handoffPath.defaultPathStep.sourceAgendaSectionId,
    agenda.defaultAgendaSection.sectionId,
  );
  assert.deepEqual(
    handoffPath.pathSteps.map((step) => [
      step.stepNumber,
      step.sourceAgendaSectionId,
      step.sourceAgendaSectionIds,
      step.sourcePromptGroupIds,
      step.sourceCoverageRowId,
      step.sourceHandoffCardId,
      step.sourceReferences.map((reference) => [
        reference.sourceKind,
        reference.sourceId,
      ]),
      step.localAnchorHrefs,
      step.anchorTargetIds,
      step.relatedFacilitationPromptIds,
      step.relatedEvidenceStopIds,
      step.relatedGapDiscussionPointIds,
      step.relatedDeferredScopeReminderIds,
      step.staticNonGoalContexts.length,
    ]),
    agenda.sections.map((section, index) => [
      index + 1,
      section.sectionId,
      [section.sectionId],
      section.sourcePromptGroupIds,
      section.sourceCoverageRowId,
      section.sourceHandoffCardId,
      [
        ["agenda_section", section.sectionId],
        ["prompt_group", section.sourcePromptGroupId],
        ["coverage_row", section.sourceCoverageRowId],
        ["handoff_card", section.sourceHandoffCardId],
      ],
      section.localAnchorHrefs,
      section.localAnchorHrefs.map((href) => href.replace("#", "")),
      section.facilitationPromptIds,
      section.evidenceStopIds,
      section.gapDiscussionPointIds,
      section.deferredScopeReminderIds,
      section.staticNonGoalContexts.length,
    ]),
  );
  assert.ok(
    handoffPath.pathSteps.every(
      (step) =>
        step.localOnly &&
        step.sourceBacked &&
        step.inPageOnly &&
        step.explanatoryOnly &&
        step.informationalOnly &&
        step.nonActionable &&
        step.nonPersistent &&
        step.nonExecutable &&
        step.nonRouting &&
        step.nonCertifying &&
        step.nonRanking &&
        step.notATask &&
        step.notATicket &&
        step.notAChecklist &&
        step.notOwnerAssigned &&
        step.staticNonGoalFlags.noSavedPathProgress &&
        step.staticNonGoalFlags.noRouteChanges &&
        step.staticNonGoalFlags.noCommandExecution &&
        step.staticNonGoalFlags.noExports,
    ),
  );
});

test("buildReviewObservationHandoffPath keeps anchor map entries in-page and non-actionable", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const agenda = view.reviewObservationHandoffAgenda;
  const handoffPath = view.reviewObservationHandoffPath;
  const missionConsoleSource = readFileSync(
    resolve(
      repoRoot,
      "frontend/src/features/mission-console/MissionConsole.tsx",
    ),
    "utf8",
  );

  assert.ok(agenda);
  assert.ok(handoffPath);
  assert.deepEqual(
    handoffPath.anchorMapEntries.map((entry) => [
      entry.sourceAgendaSectionId,
      entry.anchorOrder,
      entry.localAnchorHref,
      entry.anchorTargetId,
      entry.sourcePromptGroupId,
      entry.sourceCoverageRowId,
      entry.sourceHandoffCardId,
    ]),
    agenda.sections.flatMap((section) =>
      section.localAnchorHrefs.map((href, index) => [
        section.sectionId,
        index + 1,
        href,
        href.replace("#", ""),
        section.sourcePromptGroupId,
        section.sourceCoverageRowId,
        section.sourceHandoffCardId,
      ]),
    ),
  );
  assert.equal(
    handoffPath.summary.counts.pathStepCount,
    agenda.sections.length,
  );
  assert.equal(
    handoffPath.summary.counts.anchorMapEntryCount,
    agenda.sections.reduce(
      (total, section) => total + section.localAnchorHrefs.length,
      0,
    ),
  );
  assert.equal(
    handoffPath.summary.counts.sourceFacilitationPromptCount,
    agenda.facilitationPrompts.length,
  );
  assert.ok(
    handoffPath.anchorMapEntries.every(
      (entry) =>
        entry.localOnly &&
        entry.inPageOnly &&
        entry.explanatoryOnly &&
        entry.informationalOnly &&
        entry.nonActionable &&
        entry.nonPersistent &&
        entry.nonExecutable &&
        entry.nonRouting &&
        entry.nonCertifying &&
        entry.nonRanking &&
        entry.notATask &&
        entry.notATicket &&
        entry.notAChecklist &&
        entry.notOwnerAssigned,
    ),
  );

  for (const entry of handoffPath.anchorMapEntries) {
    assert.ok(entry.localAnchorHref.startsWith("#"));
    assert.ok(
      missionConsoleSource.includes(`id="${entry.anchorTargetId}"`),
      `${entry.anchorTargetId} should resolve to an existing mission-console section`,
    );
  }

  assert.ok(
    missionConsoleSource.includes(
      'id="review-observation-handoff-path"',
    ),
    "Mission console should expose a local Stage 42 handoff path anchor",
  );
});
