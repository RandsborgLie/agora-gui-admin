/**
 * This file is part of agora-gui-admin.
 * Copyright (C) 2015-2016  Agora Voting SL <agora@agoravoting.com>

 * agora-gui-admin is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License.

 * agora-gui-admin  is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.

 * You should have received a copy of the GNU Affero General Public License
 * along with agora-gui-admin.  If not, see <http://www.gnu.org/licenses/>.
**/

angular.module('avAdmin')
  .directive('avAdminElcensusConfig', function($window, $state, ElectionsApi, MustExtraFieldsService, ConfigService) {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
        scope.census = ['open', 'close'];
        scope.election = ElectionsApi.currentElection;
        scope.electionEditable = function() {
          return !scope.election.id || scope.election.status === "registered";
        };
        scope.newef = {};
        scope.newcensus = {};
        scope.extra_fields = {editing: null};
        scope.massiveef = "";
        scope.loadingcensus = !ElectionsApi.newElection;
        scope.helpurl = ConfigService.helpUrl;

        function addEf() {
            var el = ElectionsApi.currentElection;
            var efs = el.census.extra_fields;

            var ef = {
                name: scope.newef.name,
                type: "text",
                required: scope.newef.required,
                min: 2,
                max: 200,
                private: false,
                required_on_authentication: false,
                must: false,
                "register-pipeline": []
            };

            scope.extra_fields.editing = ef;

            scope.newef = {};
            efs.unshift(ef);
        }

        angular.extend(scope, {
            addEf: addEf
        });

        function main() {
            scope.election = ElectionsApi.currentElection;
            MustExtraFieldsService(scope.election);
        }

        ElectionsApi.waitForCurrent(main);
    }

    return {
      restrict: 'AE',
      scope: {
      },
      link: link,
      templateUrl: 'avAdmin/admin-directives/elcensus-config/elcensus-config.html'
    };
  });
