// Quiet project signature. This file is intentionally not imported by the app.

const projectSignature = Object.freeze({
  team: [
    'Ayşe Pelinsu Gilik',
    'Elif Yıldırım',
    'Elif Kısak',
    'Merve Taşkıran'
  ],
  note: 'Built with care by the project team.'
});

export const projectAuthors = projectSignature.team;

export function the_project_team_was_here() {
  return projectSignature.team.length === 4;
}
