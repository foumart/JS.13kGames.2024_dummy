function action(direction) {
	if (paused) return;//hardChoice
	if (!direction && (inBattle || battleIntro)) {
		// Attack button clicked
		if (inBattle) beginNewRound(); else dungeonBattle();
		return;
	}
	if (battleIntro && direction) {// equivalent to tapping Run
		closeAllScreens();
	}
	let _unit;
	switch (direction) {
		case 1: // Up
			if (inDialog || inBattle) return;
			boarding = playerX == shipX && playerY-1 == shipY && onFoot;
			landing = !onFoot && !isPassable(playerX, playerY-1, TileType.LAND);
			if (isPassable(playerX, playerY-1) || boarding || landing) {
				_unit = getUnit(playerX, playerY-1);
				if (_unit && _unit.type == UnitType.CASTLE && _unit.origin > 1) {
					prepareSurfaceBattle(_unit, 1);
					return;
				}
				if (_unit && _unit.type > UnitType.SHIPRIGHT && _unit.type < UnitType.CASTLE) {
					prepareSurfaceBattle(_unit);
					return;
				}
				unitsData[playerY][playerX] = landing ? UnitType.SHIPLEFT : gamePlayer.overlay;
				playerY --;
				gamePlayer.y --;
				if (!onFoot && !landing) gameShip.y --;
				if (playerY < jump) {// TODO: fix wrapping or make the map constrained
					playerY = boardWidth-1;
					gamePlayer.y += boardWidth-jump;
				}
				tween.transitionY = -1;
				TweenFX.to(tween, 6, {transitionY: 0}, e => doFrameAnimationMove(), e => finalizeMove(1));
				prepareToMove(1);
			}

			break;
		case 2: // Right
			if (inDialog || inBattle) return;
			boarding = playerX+1 == shipX && playerY == shipY && onFoot;
			landing = !onFoot && !isPassable(playerX+1, playerY, TileType.LAND);
			if (isPassable(playerX+1, playerY) || boarding || landing) {
				_unit = getUnit(playerX+1, playerY);
				if (_unit && _unit.type == UnitType.CASTLE && _unit.origin > 1) {
					prepareSurfaceBattle(_unit, 1);
					return;
				}
				if (_unit && _unit.type > UnitType.SHIPRIGHT && _unit.type < UnitType.CASTLE) {
					prepareSurfaceBattle(_unit);
					return;
				}
				unitsData[playerY][playerX] = landing ? UnitType.SHIPUP : gamePlayer.overlay;
				playerX ++;
				gamePlayer.x ++;
				if (!onFoot && !landing) gameShip.x ++;
				if (playerX > boardWidth-1) {
					playerX = jump;
					gamePlayer.x -= boardWidth-jump;
				}
				tween.transitionX = 1;
				TweenFX.to(tween, 6, {transitionX: 0}, e => doFrameAnimationMove(), e => finalizeMove(2));
				prepareToMove(2);
			}

			break;
		case 3: // Down
			if (inDialog || inBattle) return;
			boarding = playerX == shipX && playerY+1 == shipY && onFoot;
			landing = !onFoot && !isPassable(playerX, playerY+1, TileType.LAND);
			if (isPassable(playerX, playerY+1) || boarding || landing) {
				_unit = getUnit(playerX, playerY+1);
				if (_unit && _unit.type == UnitType.CASTLE && _unit.origin > 1) {
					prepareSurfaceBattle(_unit, 1);
					return;
				}
				if (_unit && _unit.type > UnitType.SHIPRIGHT && _unit.type < UnitType.CASTLE) {
					prepareSurfaceBattle(_unit);
					return;
				}
				unitsData[playerY][playerX] = landing ? UnitType.SHIPRIGHT : gamePlayer.overlay;
				playerY ++;
				gamePlayer.y ++;
				if (!onFoot && !landing) gameShip.y ++;
				if (playerY > boardWidth-1) {
					playerY = jump;
					gamePlayer.y -= boardWidth-jump;
				}
				tween.transitionY = 1;
				TweenFX.to(tween, 6, {transitionY: 0}, e => doFrameAnimationMove(), e => finalizeMove(3));
				prepareToMove(3);
			}

			break;
		case 4: // Left
			if (inDialog || inBattle) return;
			boarding = playerX-1 == shipX && playerY == shipY && onFoot;
			landing = !onFoot && !isPassable(playerX-1, playerY, TileType.LAND);
			if (isPassable(playerX-1, playerY) || boarding || landing) {
				_unit = getUnit(playerX-1, playerY);
				if (_unit && _unit.type == UnitType.CASTLE && _unit.origin > 1) {
					prepareSurfaceBattle(_unit, 1);
					return;
				}
                if (_unit && _unit.type > UnitType.SHIPRIGHT && _unit.type < UnitType.CASTLE) {
					prepareSurfaceBattle(_unit);
					return;
				}
				unitsData[playerY][playerX] = landing ? UnitType.SHIPDOWN : gamePlayer.overlay;
				playerX --;
				gamePlayer.x --;
				if (!onFoot && !landing) gameShip.x --;
				if (playerX < jump) {
					playerX = boardWidth-1;
					gamePlayer.x += boardWidth-jump;
				}
				tween.transitionX = -1;
				TweenFX.to(tween, 6, {transitionX: 0}, e => doFrameAnimationMove(), e => finalizeMove(4));
				prepareToMove(4);
			}

			break;

		default: // Action
			_unit = getUnit(playerX, playerY);
			if (hasTutorial) {
				hasTutorial = '<br>Upgrade Ship at Castle ' + getSpan('&#9873', colors[1]) + '<br><br>Conquer Forts ';
				for (_unit = 2; _unit < colors.length; _unit++) {
					hasTutorial += " " + getSpan('&#9873', colors[_unit]);
				}
				prepareDialog("", hasTutorial + " to<br>recruit crew. You have 13 days to defeat the Balrog!<br>");
			} else
			if (gamePlayer.overlay == UnitType.CASTLE) {
				// CASTLES AND FORTS
				let _hplost = playerHealthMax - playerHealth + crewHealthMax - crewHealth;
				let _rest = moveLimit - moveLeft;
				let _shiplost = shipHealthMax - shipHealth;

				let _castleId = 1;
				let _crewUpgraded;
				let _castleToUpdate;
				castles.forEach(castle => {
					if (playerX == castle[1] && playerY == castle[2]) {
						_castleId = castle[0];
						_castleToUpdate = castle;
						_crewUpgraded = castle[3];
					}
				});
				let _shipMenu = _castleId == 1;
				let _crewMenu = _castleId > 1;

				let _amount =
					_hplost ? 1 + _hplost / 2 | 0 :
					_rest ? _rest * 2 :
					_shiplost ? 1 + _shiplost / 2 | 0 :
					shipLevel < 4 || _shiplost ? shipPrices[shipLevel-1] :
					_crewMenu && !_crewUpgraded ? crewPrices[shipLevel-1] : 0;

				prepareDialog(
					// Label
					(_castleId > 1 ? "Fort " + getSpan('&#9873', colors[_castleId]) : "Castle"),
					"",
					e => {
						if (_rest) {
							prepareDialog(
								"Inn",
								"Refresh Ship movement<br>" + getSpan("<br><u>Advances time by 1 day</u>!<br>", "#ffd"),
								e => {
									// Rest
									if (spendGold(_amount)) return;
									backFromDialog();
									moveLeft = moveLimit;
									timePassed ++;
									updateInfoTab();
									fadeBackground();
									prepareDialog("Day " + timePassed, `<br>${14 - timePassed} days to defeat the Balrog!<br>`, closeAllScreens);
									obscureStage();
									revealAroundUnit(playerX, playerY);
								}, "Rest " + goldIcon + _amount,
								e => {
									action();
								}, "Back"
							);
						}
					}, getSpan("Inn", _rest ? 0 : "#caa"),
					
					e => {
						if (_hplost) {
							prepareDialog(
								"Healer",
								"<br>Restore Hero and Crew HP<br>",
								e => {
									// Heal
									if (spendGold(_amount)) return;
									healPlayer(_hplost);
									backFromDialog();
									updateInfoTab();
								}, "Heal " + goldIcon + _amount,
								e => {
									action();
								}, "Back"
							);
						}
					}, getSpan("Healer", _hplost ? 0 : "#aca"),
				);

				prepareDialogButtons(
					dialog,
					displayDialog,
					e => {
						if (_shipMenu && (shipLevel < 4 || _shiplost)) {
							prepareDialog(
								"Shipyard",
								_shiplost
									? "<br>Repair Ship damage<br><br>"
									: `<br>Upgrade Ship HP+${shipLevel != 2 ? 12 : 10}<br>Ship Attack +2<br>`,
								e => {
									// Upgrade or Repair Ship
									if (spendGold(_amount)) return;
									if (_shiplost) {
										if (spendGold(_shiplost * 5)) return;
										shipHealth += _shiplost;
									} else {
										if (spendGold(shipPrices[shipLevel-1])) return;
										shipAttack += 2;
										shipLevel ++;
										shipHealthMax = shipHealth += shipLevel == 3 ? 10 : 12;
									}
									animateUnitHit(1, 0, 2);
									backFromDialog();
									resizeUI();
									infoButtonClick(1);
								}, (_shiplost ? "Repair " : "Deal ") + goldIcon + _amount,
								e => {
									action();
								}, "Back"
							);
						} else if (_crewMenu && !_crewUpgraded) {
							prepareDialog(
								"Barracks",
								`<br>Crew HP +10<br>Attack +2<br>`,
								e => {
									// Upgrade Crew
									if (spendGold(_amount)) return;
									_castleToUpdate[3] = 1;
									crewHealth += 12;
									crewHealthMax += 12;
									crewAttack += 2;
									crewLevel ++;
									animateUnitHit(2, 0, 2);
									backFromDialog();
									resizeUI();
									infoButtonClick(2);
								}, "Recruit " + goldIcon + _amount,
								e => {
									action();
								}, "Back"
							);
						}
					}, _shipMenu
						? getSpan("Shipyard", shipLevel < 4 ? 0 : "#caa")
						: getSpan("Barracks", !_crewUpgraded ? 0 : "#caa"),
					
					displayDialog
				);
			} else
			if (gamePlayer.overlay == UnitType.SHRINE) {
				dungeon = _unit.dungeon;
				displayDungeon();
			} else
			if (gamePlayer.overlay == UnitType.TREE && (playerHealth < playerHealthMax || crewHealth < crewHealthMax)) {
				healPlayer();
				getUnit(playerX, playerY).apple = 0;
				updateActionButton();
			} else {
				// PASS action
				if (inDialog) displayDialog();// hide the dialog
				tween.transitionZ = 1;
				TweenFX.to(tween, 6, {transitionZ: 0}, e => doFrameAnimationMove(), e => finalizeMove(0));
				performEnemyMoves();
			}

		break;
	}
}