// src/app/components/about/about.component.ts
import { Component } from '@angular/core';

import { TeamMember } from '../../../models/team-member.model';
import { TEAM_MEMBERS } from '../../../constants/team-members';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  imports: [
    CommonModule
  ],
  templateUrl: './about.html',
  styleUrls: ['./about.scss']
})
export class About {
  teamMembers: TeamMember[] = TEAM_MEMBERS;

  constructor() { }
}