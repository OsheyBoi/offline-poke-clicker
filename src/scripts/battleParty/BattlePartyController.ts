class BattlePartyController {
    public static openBattlePartyModal() {
        if (App.game.battleParty.canAccess()) {
            $('#battlePartyModal').modal('show');
        } else {
            Notifier.notify({
                message: 'You do not have access to the Party yet.<br/><i></i>',
                type: NotificationConstants.NotificationOption.warning,
            });
        }
    }
    public static onBattlePartySlotClick(index) {
        if (App.game.battleParty.canAccess()) {
            App.game.battleParty.onSlotClick(index);
        } else {
            Notifier.notify({
                message: 'You do not have access to the Party yet.<br/><i></i>',
                type: NotificationConstants.NotificationOption.warning,
            });
        }
    }
}
