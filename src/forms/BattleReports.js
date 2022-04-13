import NestedReportList from '../components/NestedReportList';
import { Section } from '../components/Section';
import { SnapshotTable } from '../components/SnapshotTable';
import { SnapshotModsTable } from '../components/SnapshotModsTable';
import { useState } from 'react';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';

export function BattleReports({ report }) {
  const [fB, sB, data] = report.data;
  const [main, setMain] = useState(false);

  return (
    <Section>
      <SnapshotTable battleflyA={fB} battleflyB={sB} />

      <div style={{ height: 50 }} />

      <SnapshotModsTable fB={fB} sB={sB} />

      <div style={{ height: 50 }} />

      <FormGroup>
        <FormControlLabel
          control={<Checkbox value={main} onChange={() => setMain((main) => !main)} />}
          label="Show only main events"
        />
      </FormGroup>

      <NestedReportList key={Math.random()} items={data} main={main} />
    </Section>
  );
}
